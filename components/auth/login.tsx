/* Libraries */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { Button, CircularProgress, TextField } from '@mui/material';

/* Components */
import { isUserLoggedIn, login } from '../api/api';
import ComponentAuthHeader from './formHeader';

function ComponentLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState<{ username: string, password: string }>({
        username: "",
        password: ""
    });
    const [isError, setIsError] = useState<boolean>(false);
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

    return (
        <form onSubmit={e => {
            e.preventDefault();
            setIsFormDisabled(true);
            login({ username: formData.username, password: formData.password }).then(result => {
                localStorage.setItem("LOGIN_JWT", result);
                isUserLoggedIn().then(result => {
                    if (result == true)
                        router.push("/board");
                }).catch((error: AxiosError) => {
                    console.warn(error);
                })
            }).catch((error: AxiosError) => {
                setIsError(true);
                console.warn(error);
            }).finally(() => { setIsFormDisabled(false); })
        }} autoComplete="new-password" aria-autocomplete='none' className='flex flex-col'>
            <ComponentAuthHeader headerText="Sign In" />
            <span className='font-bold text-sm mb-2'>Username</span>
            <TextField
                error={isError}
                className='mb-6'
                InputLabelProps={{ shrink: false }}
                value={formData.username}
                onChange={e => { setFormData({ ...formData, username: e.target.value }); setIsError(false); }}
                type='text'
                fullWidth
                autoComplete="new-password"
                aria-autocomplete='none'
                size='small'
                label={formData.username.length == 0 ? "Username" : ""}
                variant='outlined' />

            <span className='font-bold text-sm mb-2'>Password</span>
            <TextField
                error={isError}
                helperText={isError ? "Incorrect username or password, Please try again." : ""}
                InputLabelProps={{ shrink: false }}
                value={formData.password}
                onChange={e => { setFormData({ ...formData, password: e.target.value }); setIsError(false); }}
                type='password'
                fullWidth
                autoComplete="new-password"
                aria-autocomplete='none'
                size='small'
                label={formData.password.length == 0 ? "Password" : ""}
                variant='outlined' />

            <Button
                disabled={isFormDisabled}
                type='submit'
                className='mb-2 mt-8'
                variant='contained'>{isFormDisabled == false ? "Log in" : <CircularProgress size={"2.5rem"} className='p-1' sx={{ color: "white" }} />}</Button>
            <Link href={"/register"}>
                <Button type='button' className='my-2' variant='outlined' fullWidth color='info'>Create account</Button>
            </Link>
        </form >
    )
}

export default ComponentLogin;