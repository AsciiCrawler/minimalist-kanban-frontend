/* Libraries */
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { Button, CircularProgress, Divider, TextField } from '@mui/material';

/* Components */
import { isUserLoggedIn, login, isUsernameAvailable, register, generateCaptcha, validateCaptcha, renewCaptcha } from '../api/api';
import ComponentAuthHeader from './formHeader';

const ComponentReturnToLogin = () => {
    return (
        <Link href={"/"}>
            <Button type='button' className='my-2' fullWidth variant='outlined' color='info'>Already have an account? Login here</Button>
        </Link>
    )
};

function ComponentRegister() {
    const router = useRouter();
    const [captcha, setCaptcha] = useState<{ url: string; uuid: string, code: string } | null>(null);
    useEffect(() => {
        generateCaptcha().then(result => {
            setCaptcha({ url: result.url, uuid: result.uuid, code: "" });
        }).catch((error: AxiosError) => {
            console.warn(error);
        })
    }, [])

    const [step, setStep] = useState<number>(0);

    const [formData, setFormData] = useState<{ username: string, password: string, passwordConfirmation: string, phone: string }>({
        username: "",
        password: "",
        passwordConfirmation: "",
        phone: ""
    });

    const [isErrorUsernameNoValidCharacters, setIsErrorUsernameNoValidCharacters] = useState<boolean>(false);
    const [isErrorUsernameNoValidLegth, setIsErrorUsernameNoValidLength] = useState<boolean>(false);
    const [isErrorUsernameNotAvailalble, setIsErrorUsernameNotAvailable] = useState<boolean>(false);
    const isUsernameValidLenth = () => formData.username.length >= 5;
    const isUsernameValidSyntax = (): boolean => {
        const regex = /^[a-zA-Z0-9_-]*$/;
        return regex.test(formData.username);
    }
    const getUsernameHelperText = () => {
        if (isErrorUsernameNoValidLegth == true) {
            return "The username must be at least 5 characters long";
        }

        if (isErrorUsernameNoValidCharacters == true) {
            return "The username can only contain letters, numbers, underscores and hyphens.";
        }

        if (isErrorUsernameNotAvailalble == true) {
            return "The username is not available. Please choose a different username";
        }

        return "";
    }

    /*  */

    const [isErrorPasswordNoValidCharacters, setIsErrorPasswordNoValidCharacters] = useState<boolean>(false);
    const [isErrorPasswordNoValidLegth, setIsErrorPasswordNoValidLength] = useState<boolean>(false);
    const isPasswordLegthValid = () => formData.password.length >= 5;
    const isPasswordValidSyntax = () => {
        const regex = /^[a-zA-Z0-9_-]*$/;
        return regex.test(formData.password);
    }
    const getPasswordHelperText = () => {
        if (isErrorPasswordNoValidLegth == true) {
            return "The password must be at least 5 characters long";
        }

        if (isErrorPasswordNoValidCharacters == true) {
            return "The password can only contain letters, numbers, underscores and hyphens.";
        }

        return "";
    }

    /*  */

    const [isErrorPasswordConfirmation, setIsErrorPasswordConfirmation] = useState(false);
    const isPasswordConfirmationValid = (value: string) => formData.password == value;
    const isPasswordConfirmationValidNoParam = () => formData.password == formData.passwordConfirmation;
    const getPasswordConfirmationHelperText = () => {
        if (isErrorPasswordConfirmation == true) {
            return "The password confirmation does not match the password";
        }

        return "";
    }


    const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);
    const getCaptchaErrorHelperText = () => {
        if (isCaptchaError == true)
            return "Your entry did not match the image. Please try again";
        return "";
    }

    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
    if (step == 0) {
        return (
            <form autoComplete="new-password" aria-autocomplete='none' onSubmit={e => {
                e.preventDefault();
                if (!isUsernameValidLenth()) return;
                if (!isUsernameValidSyntax()) return;

                if (!isPasswordLegthValid()) return;
                if (!isPasswordValidSyntax()) return;

                if (!isPasswordConfirmationValidNoParam()) return;

                setIsFormDisabled(true);
                isUsernameAvailable(formData.username).then((data) => {
                    if (data.isAvailable == true) {
                        setStep(1);
                        setIsErrorUsernameNotAvailable(true);
                    } else
                        setIsErrorUsernameNotAvailable(false);
                }).catch((error: AxiosError) => {
                    setIsErrorUsernameNotAvailable(true);
                    console.warn(error);
                }).finally(() => {
                    setIsFormDisabled(false);
                });
            }} className='flex flex-col' >
                <ComponentAuthHeader headerText="Sign Up" />
                <span className='font-bold text-sm mb-2'>Username</span>
                <TextField
                    error={isErrorUsernameNotAvailalble || isErrorUsernameNoValidLegth || isErrorUsernameNoValidCharacters}
                    helperText={getUsernameHelperText()}
                    InputLabelProps={{ shrink: false }}
                    value={formData.username}
                    onChange={e => {
                        setFormData({ ...formData, username: e.target.value });
                        setIsErrorUsernameNoValidCharacters(false);
                        setIsErrorUsernameNoValidLength(false);
                        setIsErrorUsernameNotAvailable(false);
                    }}
                    onBlur={async () => {
                        if (!isUsernameValidLenth())
                            setIsErrorUsernameNoValidLength(true);

                        if (!isUsernameValidSyntax())
                            setIsErrorUsernameNoValidCharacters(true);

                        await isUsernameAvailable(formData.username).then((data) => {
                            if (data.isAvailable == false)
                                setIsErrorUsernameNotAvailable(true);
                            else
                                setIsErrorUsernameNotAvailable(false);


                        }).catch((error: AxiosError) => {
                            setIsErrorUsernameNotAvailable(true);
                            console.warn(error);
                        });
                    }}
                    type='text'
                    fullWidth
                    size='small'
                    id='username'
                    name='username'
                    autoComplete="new-password"
                    aria-autocomplete='none'
                    label={formData.username.length == 0 ? "Username" : ""}
                    variant='outlined' />

                <Divider variant='fullWidth' className='my-4' />

                <input onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); }} value={formData.phone} className='w-0 h-0 p-0 m-0 opacity-[0.05]' autoComplete="new-password" aria-autocomplete='none' tabIndex={-1} type="text" name="phone" id="phone" />

                <span className='font-bold text-sm mb-2'>Password</span>
                <TextField
                    className='mb-4'
                    error={isErrorPasswordNoValidLegth || isErrorPasswordNoValidCharacters}
                    helperText={getPasswordHelperText()}
                    InputLabelProps={{ shrink: false }}
                    value={formData.password}
                    onChange={e => {
                        setFormData({ ...formData, password: e.target.value });
                        setIsErrorPasswordNoValidCharacters(false);
                        setIsErrorPasswordNoValidLength(false);

                        if (formData.passwordConfirmation == "") {
                            return;
                        }

                        if (formData.passwordConfirmation != e.target.value) {
                            setIsErrorPasswordConfirmation(true);
                        } else {
                            setIsErrorPasswordConfirmation(false);
                        }
                    }}
                    onBlur={() => {
                        if (!isPasswordLegthValid()) {
                            setIsErrorPasswordNoValidLength(true);
                        }

                        if (!isPasswordValidSyntax()) {
                            setIsErrorPasswordNoValidCharacters(true);
                        }
                    }}
                    type='password'
                    fullWidth
                    size='small'
                    id='password'
                    name='password'
                    autoComplete="new-password"
                    aria-autocomplete='none'
                    label={formData.password.length == 0 ? "Password" : ""}
                    variant='outlined' />

                <span className='font-bold text-sm mb-2'>Retype password</span>

                <TextField
                    error={isErrorPasswordConfirmation}
                    helperText={getPasswordConfirmationHelperText()}
                    InputLabelProps={{ shrink: false }}
                    value={formData.passwordConfirmation}
                    onChange={e => {
                        setFormData({ ...formData, passwordConfirmation: e.target.value });
                        if (!isPasswordConfirmationValid(e.target.value)) {
                            setIsErrorPasswordConfirmation(true);
                        } else {
                            setIsErrorPasswordConfirmation(false);
                        }
                    }}

                    type='password'
                    fullWidth
                    size='small'
                    id='password-confirmation'
                    name='password-confirmation'
                    label={formData.passwordConfirmation.length == 0 ? "Retype password" : ""}
                    variant='outlined' />

                <Button
                    type='submit'
                    disabled={isFormDisabled}
                    className='mb-2 mt-8'
                    variant='contained'>{isFormDisabled == false ? "Create account" : <CircularProgress size={"2.5rem"} className='p-1' sx={{ color: "white" }} />}</Button>
                {<ComponentReturnToLogin />}
            </form >
        )
    }

    if (step == 1 && captcha != null) {
        return (
            <form autoComplete="new-password" aria-autocomplete='none' className='flex flex-col' onSubmit={async (e) => {
                e.preventDefault();

                try {
                    setIsFormDisabled(true);
                    await validateCaptcha(captcha.uuid, captcha.code).then(() => { }).catch((error: AxiosError) => {
                        setIsCaptchaError(true);
                        throw error;
                    });
                    await register({ username: formData.username, password: formData.password, uuid: captcha?.uuid ?? "", phone: formData.phone }).then(() => { }).catch((err: AxiosError) => { throw err; })
                    await login({ username: formData.username, password: formData.password }).then().then((result) => { localStorage.setItem("LOGIN_JWT", result); }).catch((error: AxiosError) => { throw error; })
                    await isUserLoggedIn().then((response) => { if (response == true) router.push("/board"); }).catch((error: AxiosError) => { throw error; })
                } catch (error) {
                    renewCaptcha(captcha.uuid).then(result => {
                        setCaptcha({ ...captcha, url: result.url, code: "" });
                    }).catch(error => { throw error; })
                    setIsFormDisabled(false);
                    console.warn(error);
                }
            }}>
                <ComponentAuthHeader headerText="Sign Up" />
                {
                    captcha != null &&
                    <Fragment>
                        <div className='flex flex-col w-full justify-center items-center'>
                            <img className='w-[65%] aspect-video rounded-sm mb-4' src={process.env.NEXT_PUBLIC_CDN + "/" + captcha.url} alt="Captcha URL" />
                            <TextField
                                fullWidth
                                error={isCaptchaError}
                                size='small'
                                variant='outlined'
                                helperText={getCaptchaErrorHelperText()}
                                placeholder='Enter the text you see above'
                                value={captcha.code}
                                onChange={e => {
                                    setIsCaptchaError(false);
                                    setCaptcha({ ...captcha, code: e.target.value });
                                }}></TextField>
                        </div>
                    </Fragment>
                }

                <Button
                    disabled={isFormDisabled}
                    type='submit'
                    className='mb-2 mt-8'
                    variant='contained'>{isFormDisabled == false ? "Create account" : <CircularProgress size={"2.5rem"} className='p-1' sx={{ color: "white" }} />}</Button>
                {<ComponentReturnToLogin />}
            </form >
        )
    }

    return null;
}

export default ComponentRegister;