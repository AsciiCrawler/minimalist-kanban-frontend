/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import { Avatar, AvatarGroup, Card, Chip, CircularProgress, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Popover } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

/* Components */
import { CardInterface, deleteCard } from '../api/api';
import { AppContext } from '../context/context';

/* Assets */
import { stringAvatar } from '../utils/utils';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const ComponentBoardCard = ({ item, index }: { item: CardInterface, index: number }) => {
    const { setCurrentCard, setCurrentCardDelta, getAllCards } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    return (
        <Fragment>
            <Draggable draggableId={item._id} index={index}>
                {(provided) => (
                    <Card
                        elevation={2}
                        data-color-mode="light"
                        onClick={() => { setCurrentCard({ ...item }); setCurrentCardDelta({ ...item }); }}
                        className={`border-[1px] mx-2 my-2 flex flex-col px-2 py-2 text-sm`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <div className='flex w-full'>

                            <span className='inline-block overflow-hidden text-ellipsis font-bold text-sm mb-2 pr-2'>{item.title}</span>
                            <IconButton
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setAnchorEl(event.currentTarget);
                                }}
                                className='p-0 ml-auto'>
                                <MoreHorizIcon />
                            </IconButton>
                        </div>

                        <div className='flex items-end mt-4' >
                            <Chip className='mx-[2px] px-1' size='small' icon={<AttachmentRoundedIcon />} label={(() => {
                                try {
                                    return item.attachments.length;
                                } catch (error) {
                                    return 0;
                                }
                            })()} />

                            <Chip className='mx-[2px] px-1' size='small' icon={<MessageRoundedIcon />} label={(() => {
                                try {
                                    return item.comments.length;
                                } catch (error) {
                                    return 0;
                                }
                            })()} />
                            <AvatarGroup
                                className='ml-auto'
                                sx={{
                                    '& .MuiAvatar-root': { width: 20, height: 20, fontSize: 10 },
                                }}
                                max={4}>
                                {
                                    item.assignedTo != null && item.assignedTo.length > 0 && item.assignedTo.map(e => {
                                        return (
                                            <Avatar key={e._id} {...stringAvatar(e.username)} />
                                        );
                                    })
                                }
                            </AvatarGroup>
                        </div>
                    </Card>
                )}
            </Draggable>

            <Popover
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                id={item._id + "popop_card"}
                open={anchorEl != null}
                anchorEl={anchorEl}
                onClose={() => { setAnchorEl(null); }}
            >
                <List
                    subheader={<ListSubheader>Card options</ListSubheader>}
                >
                    <ListItemButton
                        className='flex justify-center'
                        onClick={() => {
                            setIsDeleting(true);
                            deleteCard({ cardId: item._id }).then(() => {
                                getAllCards();
                            }).catch((error) => {
                                console.warn(error);
                            }).finally(() => {
                                setAnchorEl(null);
                                setTimeout(() => {
                                    setIsDeleting(false);
                                }, 150);
                            })
                        }}>
                        {isDeleting === false ? <Fragment>
                            <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                                <DeleteForeverRoundedIcon color='error' />
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={{ color: "#d32f2f" }} primary="Delete card"></ListItemText>
                        </Fragment> : <CircularProgress className='justify-self-center' color='error' size={18}></CircularProgress>}
                    </ListItemButton>
                </List>
            </Popover>
        </Fragment>
    );
};

export default ComponentBoardCard;