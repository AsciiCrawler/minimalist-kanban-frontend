/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import moment from 'moment';
import { Button, CircularProgress } from '@mui/material';

/* Components */
import { AppContext } from '@/components/context/context';
import { AttachmentInterface, deleteFile } from '@/components/api/api';
import { AxiosError } from 'axios';

export const ComponentAttachment = ({ data, setAttachmentIndex, index }: { data: AttachmentInterface, setAttachmentIndex: React.Dispatch<React.SetStateAction<number>>, index: number }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { reloadCardCata, currentCard } = useContext(AppContext);
    if (currentCard == null) return null;

    return (
        <Fragment>
            <div onClick={() => { setAttachmentIndex(index); }} className='flex w-full max-w-full py-4 px-2 hover:bg-gray-200 transition-colors hover:cursor-pointer rounded-xl'>
                <div className='flex max-w-[25%] w-full h-full aspect-[4/3]'>
                    <img className='rounded-md w-full h-full object-cover object-center' src={`${process.env.NEXT_PUBLIC_CDN}/${data.url}`} alt={`Imaged uploaded by ${data.user.lowercaseUsername} at ${data.creationDate.toString()}`} />
                </div>
                <div className='flex flex-col flex-1 pl-4 pt-2'>
                    <span>Added: <span className='font-bold'>{moment(data.creationDate).format('Do MMMM YYYY, h:mm a')}</span></span>
                    <span className='font-bold text-sm'>{data.user.username}</span>

                    <div className='mt-auto'>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLoading(true);
                            deleteFile(currentCard._id, data._id).then(async () => {
                                await reloadCardCata("ATTACHMENT").then(() => { }).catch((error: AxiosError) => { throw error; });
                            }).catch((error: AxiosError) => {
                                setIsLoading(false);
                                console.warn(error);
                            });
                        }} variant='outlined' size='small' color='error'>{isLoading == true ? <CircularProgress color="error" size={18} /> : "Delete"}</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}