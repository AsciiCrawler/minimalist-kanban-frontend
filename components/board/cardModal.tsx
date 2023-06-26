/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Paper } from '@mui/material';

/* Components */
import { AppContext } from '../context/context';
import { ComponentNoFiles, FileUploadSingle } from './cardModelComponents/uploadFiles';
import { ComponentHeaderTitle } from './cardModelComponents/header';

/* Assets */
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { ComponentComment, ComponentNewComment } from './cardModelComponents/comment';
import { ComponentDescription } from './cardModelComponents/description';
import { ComponentAttachment } from './cardModelComponents/attachment';
import { ComponentOptions } from './cardModelComponents/options';

const ComponentBoardCardModal = () => {
    const router = useRouter();
    const { boardid } = router.query;
    const { currentCard, currentCardDelta } = useContext(AppContext);

    const [attachmentIndex, setAttachmentIndex] = useState(-1);



    if (currentCard == null || currentCardDelta == null || typeof boardid !== 'string') return null;
    return (
        <Fragment>
            <Modal
                open={attachmentIndex == -1}
                className="flex justify-center items-start py-4 overflow-scroll">
                <Paper elevation={5} className={`flex flex-col bg-[#f1f2f4] w-[768px] max-w-[85vw] h-fit min-h-full p-6`}>
                    {/* Title */}
                    {<ComponentHeaderTitle />}

                    {/* Content */}
                    <div className={`flex flex-col h-[calc(100%-70px)]`}>
                        <ComponentOptions/>

                        {/* Description */}
                        {/* Description */}
                        {/* Description */}
                        <ComponentDescription
                        /* contentId={contentId}
                        generateContentId={generateContentId} */
                        />

                        {/* Attachments */}
                        {/* Attachments */}
                        {/* Attachments */}
                        <div className='flex items-center' >
                            <AttachFileRoundedIcon className='h-8 w-8 object-contain mr-4 rotate-45' />
                            <span className='font-bold'>Attachments</span>
                        </div>

                        <div className='sm:px-12'>
                            {
                                currentCard.attachments != null && currentCard.attachments.length > 0 && <Fragment>
                                    {currentCard.attachments.map((attachment, index) => {
                                        return (<ComponentAttachment key={attachment._id} data={attachment} index={index} setAttachmentIndex={setAttachmentIndex} />)
                                    })}
                                    <FileUploadSingle />
                                </Fragment>
                            }

                            {
                                (currentCard.attachments == null || currentCard.attachments.length == 0) && <ComponentNoFiles />
                            }
                        </div>

                        {/* Comments */}
                        {/* Comments */}
                        {/* Comments */}
                        <div className='flex items-center mt-12' >
                            <ForumOutlinedIcon className='h-8 w-8 object-contain mr-4' />
                            <span className='font-bold'>Comments</span>
                        </div>

                        <ComponentNewComment />
                        {
                            currentCard.comments != null &&
                            currentCard.comments.length > 0 &&
                            currentCard.comments.map((comment) => <ComponentComment key={comment._id} data={comment} />)
                        }
                    </div>
                </Paper>
            </Modal>
            <Modal open={attachmentIndex >= 0}>
                <div onClick={() => { setAttachmentIndex(-1); }} className='flex justify-center items-center w-full h-full p-12 cursor-pointer'>
                    {attachmentIndex >= 0 && <img className='w-full h-full object-contain' src={process.env.NEXT_PUBLIC_CDN + "/" + currentCard.attachments[attachmentIndex].url} alt="AttachmentPreview" />}
                </div>
            </Modal>
        </Fragment>
    );
};

export default ComponentBoardCardModal;