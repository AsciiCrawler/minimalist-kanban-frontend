/* Libraries */
import React, { useContext, useState } from 'react';
import { TextField } from '@mui/material';

/* Components */
import { updateTitle } from '@/components/api/api';
import { AppContext } from '@/components/context/context';

/* Assets */
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AxiosError } from 'axios';

export const ComponentHeaderTitle = () => {
    const { setCurrentCard, setCurrentCardDelta, getAllCards, currentCard, currentCardDelta, currentBoard } = useContext(AppContext);
    const [errorTitle, setErrorTitle] = useState<boolean>(false);


    if (currentCard == null || currentCardDelta == null || currentBoard == null) return null;
    return (
        <div className={`flex h-[70px]`}>
            <div className='flex flex-col w-full items-start'>
                <div className='flex items-center w-full' >
                    <SubtitlesOutlinedIcon className='h-8 w-8 object-contain mr-4' />
                    <TextField
                        error={errorTitle}
                        helperText={errorTitle == true ? "An unexpected error occurred. Please try again" : ""}
                        fullWidth
                        className='pr-4'
                        inputProps={{ className: "text-xl font-bold" }}
                        variant='standard'
                        onBlur={() => {
                            if (currentCard.title != currentCardDelta.title) {
                                updateTitle({ cardId: currentCard._id, title: currentCard.title }).then(() => {
                                    getAllCards();
                                }).catch((error: AxiosError) => {
                                    setErrorTitle(true);
                                    console.warn(error);
                                });
                                setCurrentCardDelta({ ...currentCardDelta, title: currentCard.title });
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                setCurrentCard({ ...currentCard, title: currentCardDelta.title });
                            }
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setErrorTitle(false);
                            setCurrentCard({ ...currentCard, title: e.target.value });
                        }}
                        type='text'
                        value={currentCard.title ?? ""} />
                </div>
            </div>
            <button onClick={() => {
                setCurrentCard(null);
                setCurrentCardDelta(null);
            }} className='flex ml-auto h-fit'>
                <CloseRoundedIcon className='h-6 w-6 object-contain' />
            </button>
        </div>
    )
}