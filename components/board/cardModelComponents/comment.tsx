/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import { Avatar, Button } from '@mui/material';

/* Components */
import ComponentTiptap from '@/components/tiptap/tiptap';
import { AppContext } from '@/components/context/context';
import { CardCommentInterface, deleteComment, postComment } from '@/components/api/api';
import { AxiosError } from 'axios';
import { stringAvatar } from '@/components/utils/utils';

function generateUUID(): string {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export const ComponentNewComment = () => {
    const { currentCard, currentBoard, currentCardDelta, getAllCards, reloadCardCata } = useContext(AppContext);
    const [contentId, setContentId] = useState(generateUUID());
    const [content, setContent] = useState<string>("");

    if (currentBoard == null || currentCardDelta == null || currentCard == null) return null;
    return (
        <Fragment>
            <div data-color-mode="light" className='sm:px-10 mt-2 mb-8'>
                <ComponentTiptap
                    size='small'
                    onUpdate={(html: string) => { setContent(html); }}
                    contentId={contentId}
                    content={content}
                    editable={true} />

                <div className='flex'>
                    <Button
                        variant='contained'
                        color='primary'
                        className='font-bold my-2 w-[80px]'
                        onClick={() => {
                            postComment({
                                cardId: currentCard._id,
                                comment: content
                            }).then(() => {
                                setContent("");
                                setContentId(generateUUID());
                                getAllCards();
                                reloadCardCata("COMMENTS");
                            }).catch((error: AxiosError) => {
                                console.warn(error);
                            })
                        }}>
                        Save
                    </Button>
                </div>
            </div>
        </Fragment>
    )
}

export const ComponentComment = ({ data }: { data: CardCommentInterface }) => {
    const { currentCard, currentBoard, getAllCards, reloadCardCata } = useContext(AppContext);

    if (currentCard == null || currentBoard == null) return null;
    return (
        <Fragment>
            <div data-color-mode="light" className='flex mt-2 mb-8'>
                {/* <Tooltip key={data.creator._id + "tooltip"} title={data.creator.username}> */}
                    <Avatar className='mr-2' {...stringAvatar(data.creator.username, 32, 12)}></Avatar>
                {/* </Tooltip> */}
                <div className='flex sm:pr-10 w-full flex-col'>
                    <ComponentTiptap
                        size='small'
                        onUpdate={(html: string) => { }}
                        contentId={"Default"}
                        content={data.comment}
                        editable={false} />
                    <Button
                        className='mt-2 w-fit'
                        size='small'
                        variant='outlined'
                        color='error'
                        onClick={() => {
                            deleteComment({
                                cardId: currentCard._id,
                                commentId: data._id
                            }).then(() => {
                                getAllCards();
                                reloadCardCata("COMMENTS");
                            }).catch((error: AxiosError) => {
                                console.warn(error);
                            })
                        }}>
                        Delete
                    </Button>
                </div>
            </div>
        </Fragment>
    )
}
