/* Libraries */
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';

/* Components */
import ComponentTiptap from '@/components/tiptap/tiptap';
import { AppContext } from '@/components/context/context';
import { updateDescription } from '@/components/api/api';

/* Assets */
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import { AxiosError } from 'axios';

function generateUUID(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export const ComponentDescription = () => {
    const { setCurrentCard, setCurrentCardDelta, getAllCards, currentCard, currentCardDelta, currentBoard } = useContext(AppContext);
    const [contentId, setContentId] = useState<string>("");
    const generateContentId = () => setContentId(generateUUID());
    useEffect(() => {
        generateContentId();
    }, [])
    const isEditMode = useMemo(() => {
        if (currentCard == null || currentCardDelta == null) return false;

        return currentCard.description != currentCardDelta.description;
    }, [currentCard?.description, currentCardDelta?.description])

    if (currentCard == null || currentCardDelta == null || currentBoard == null) return null;
    return (
        <Fragment>
            <div className='flex items-center' >
                <FormatAlignLeftRoundedIcon className='h-8 w-8 object-contain mr-4' />
                <span className='font-bold'>Description</span>
            </div>

            <div data-color-mode="light" className='sm:px-10 mt-2 mb-8'>
                <ComponentTiptap
                    size='medium'
                    onUpdate={(html: string) => {
                        setCurrentCard({ ...currentCard, description: html });
                    }}
                    contentId={contentId}
                    content={currentCardDelta?.description ?? ""}
                    editable={true} />

                <div className='flex'>
                    {isEditMode && <Button
                        variant='contained'
                        color='primary'
                        className='font-bold my-2 w-[80px]'
                        onClick={() => {
                            updateDescription({ cardId: currentCard._id, description: currentCard.description }).then(updateResult => {
                                getAllCards();
                            }).catch((error: AxiosError) => {
                                console.warn(error);
                            });
                            setCurrentCardDelta({ ...currentCardDelta, description: currentCard.description });
                        }}>
                        Save
                    </Button>}
                    {isEditMode && <Button
                        variant='outlined'
                        color='error'
                        className='font-light my-2 ml-2 w-[80px]'
                        onClick={() => {
                            generateContentId();
                            setCurrentCard({ ...currentCard, description: currentCardDelta.description });
                        }}>
                        Cancel
                    </Button>}
                </div>
            </div>
        </Fragment>
    )
}