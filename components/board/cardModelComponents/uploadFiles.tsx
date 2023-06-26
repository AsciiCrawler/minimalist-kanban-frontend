/* Libraries */
import React, { ChangeEvent, Fragment, useContext, useRef, useState } from 'react';
import { Button, CircularProgress, Skeleton } from '@mui/material';

/* Components */
import { attachFile, fileUpload, getSignedUrl, processFile } from '@/components/api/api';

/* Assets */
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { AppContext } from '@/components/context/context';
import { AxiosError } from 'axios';

export const FileUploadSingle = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getAllCards, currentBoard, currentCard, reloadCardCata } = useContext(AppContext);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (!e.target.files[0]) return;

        setIsLoading(true);
        try {
            if (currentCard == null) throw new Error("currentCard == null");

            const { signedUrl, fileUUID } = await getSignedUrl(e.target.files[0].type, e.target.files[0].size).then((data) => { return data; }).catch((error: AxiosError) => { throw error; });;
            await fileUpload({ signedUrl: signedUrl, form: e.target.files[0], contentType: e.target.files[0].type }).then(() => { }).catch((error: AxiosError) => { throw error; });;
            const { url } = await processFile(fileUUID).then((data) => { return data; }).catch((error: AxiosError) => { throw error; });;
            await attachFile(url, currentCard._id).then(() => { }).catch((error: AxiosError) => { throw error; });
            await reloadCardCata("ATTACHMENT").then(() => { }).catch((error: AxiosError) => { throw error; });
            if (currentBoard != null)
                getAllCards();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.warn(error);
        }
    };

    return (
        <div>
            <input accept="image/gif, image/jpeg, image/jpg, image/webp, image/png" hidden ref={inputRef} type="file" onChange={handleFileChange} />
            {isLoading == true && <Skeleton variant='rounded' className='w-full h-28'></Skeleton>}
            {isLoading == false && <Button onClick={() => {
                if (inputRef.current == null) return;
                inputRef.current.click();
            }}
                endIcon={<AttachFileRoundedIcon className='rotate-45' />}
                variant='contained'>Add an attachment</Button>}
        </div>
    );
}

export const ComponentNoFiles = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getAllCards, currentBoard, reloadCardCata, currentCard } = useContext(AppContext);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (!e.target.files[0]) return;

        setIsLoading(true);
        try {
            if (currentCard === null) throw new Error("No currentCard");

            const { signedUrl, fileUUID } = await getSignedUrl(e.target.files[0].type, e.target.files[0].size);
            await fileUpload({ signedUrl: signedUrl, form: e.target.files[0], contentType: e.target.files[0].type });
            const { url } = await processFile(fileUUID);
            await attachFile(url, currentCard._id);
            await reloadCardCata("ATTACHMENT").then(() => { }).catch(error => { throw error; });
            if (currentBoard != null)
                getAllCards();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.warn(error);
        }
    };

    return (
        <Fragment>
            <input
                accept="image/gif, image/jpeg, image/jpg, image/webp, image/png"
                hidden
                ref={inputRef}
                type="file"
                onChange={handleFileChange} />

            {
                isLoading == false &&
                <div
                    onClick={() => {
                        if (inputRef.current == null) return;
                        inputRef.current.click();
                    }}
                    className='flex flex-col justify-center w-full aspect-video items-center border-dashed border-[4px] border-gray-400 rounded-2xl p-8 mb-4 cursor-pointer hover:brightness-90 hover:scale-[97%] transition-all'>
                    <img className='w-full h-full object-contain' src='/empty-box.png'></img>
                    <span className='font-bold text-lg text-gray-600'>No attachment found</span>
                </div>
            }

            {
                isLoading == true &&
                <div
                    className='flex flex-col justify-center w-full aspect-video items-center border-dashed border-[4px] border-gray-400 rounded-2xl p-8 mb-4'>
                    <CircularProgress size={64} color='primary' />
                </div>
            }
        </Fragment>
    )
}