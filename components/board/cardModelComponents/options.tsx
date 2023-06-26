/* Libraries */
import React, { Fragment, useContext, useRef, useState } from 'react';
import { Avatar, AvatarGroup, Checkbox, Chip, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Popover, Tooltip } from '@mui/material';
import { AxiosError } from 'axios';

/* Components */
import { AppContext } from '@/components/context/context';
import { assignUser, unassignUser } from '@/components/api/api';
import { stringAvatar } from '@/components/utils/utils';

/* Assets */
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

export const ComponentOptions = () => {
    const { reloadCardCata, getAllCards, currentCard, currentCardDelta, currentBoard } = useContext(AppContext);

    const [anchorEL, setAnchorEL] = useState<null | HTMLElement>(null);

    const [loadingList, setLoadingList] = useState<Array<string>>([]);
    const loadingListRef = useRef<Array<string>>();
    loadingListRef.current = loadingList;

    const isLoading = (_id: string) => {
        if (loadingListRef.current == null) return false;
        return loadingListRef.current.some(u => u == _id);
    }

    const addToLoadingList = (_id: string) => {
        if (isLoading(_id) == false) {
            let _loadingList = [...loadingList];
            _loadingList.push(_id);
            setLoadingList(_loadingList);
        }
    }

    const removeFromLoadingList = (_id: string) => {
        if (isLoading(_id) == true && loadingListRef.current != null) {
            let _loadingList = [...loadingListRef.current];
            const ind = _loadingList.findIndex(e => e === _id);
            if (ind != -1) {
                _loadingList.splice(ind, 1);
                setLoadingList(_loadingList);
            }
        }
    }

    const isUserChecked = (_id: string) => {
        if (currentCard == null) return false;
        return currentCard.assignedTo.some(user => user._id === _id);
    }

    if (currentCard == null || currentCardDelta == null || currentBoard == null) return null;
    return (
        <Fragment>
            <div className='flex items-center' >
                <GroupRoundedIcon className='h-8 w-8 object-contain mr-4' />
                <span className='font-bold'>Assigned users</span>
            </div>
            <div data-color-mode="light" className='flex sm:px-10 mt-2 mb-8'>
                <button
                    onClick={(event) => { setAnchorEL(event.currentTarget) }}
                    className='flex items-center bg-transparent border-none cursor-pointer'>
                    <AvatarGroup sx={{
                        '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 12 },
                    }} max={4}>
                        {
                            currentCard.assignedTo != null && currentCard.assignedTo.length > 0 && currentCard.assignedTo.map(user => {
                                return (
                                    <Tooltip key={user._id + "tooltip"} title={user.username}>
                                        <Avatar {...stringAvatar(user.username)}></Avatar>
                                    </Tooltip>
                                );
                            })
                        }
                        {
                            currentCard.assignedTo != null && currentCard.assignedTo.length == 0 &&
                            <Chip className='cursor-pointer' label="Assign card" variant='outlined' icon={<PersonAddAlt1RoundedIcon className='ml-4' />}></Chip>
                        }
                    </AvatarGroup>
                    <Avatar className='border-[2px] border-solid border-white ml-2' sx={{ width: 36, height: 36, fontSize: 20, fontWeight: "bold" }}>+</Avatar>
                </button>
            </div>

            <Popover
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                anchorEl={anchorEL}
                open={anchorEL != null}
                onClose={() => { setAnchorEL(null); }}
            >
                <List
                    subheader={<ListSubheader>Members</ListSubheader>}>
                    {currentBoard.users.map((user, index: number) => {
                        return (
                            <ListItem
                                className='min-w-[240px]'
                                key={user._id}
                                secondaryAction={
                                    isLoading(user._id) === false ?
                                        <Checkbox
                                            key={user._id}
                                            edge="end"
                                            onChange={async (e) => {
                                                try {
                                                    addToLoadingList(user._id);
                                                    if (e.target.checked == true)
                                                        await assignUser(currentCard._id, user._id).then(() => { }).catch((error: AxiosError) => {
                                                            throw error;
                                                        })
                                                    else
                                                        await unassignUser(currentCard._id, user._id).then(() => { }).catch((error: AxiosError) => {
                                                            throw error;
                                                        })


                                                    getAllCards();
                                                    await reloadCardCata("ASSIGNED_TO");
                                                    removeFromLoadingList(user._id);
                                                } catch (error) {
                                                    console.warn(error);
                                                    removeFromLoadingList(user._id);
                                                }

                                            }}
                                            checked={isUserChecked(user._id)}
                                            inputProps={{ 'aria-labelledby': "id" }}
                                        />
                                        :
                                        <CircularProgress key={user._id} size={20} />
                                }>
                                <ListItemAvatar>
                                    <Avatar {...stringAvatar(user.username)} sx={{ width: 36, height: 36, fontSize: 14 }} />
                                </ListItemAvatar>
                                <ListItemText>{user.username}</ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </Popover>
        </Fragment>
    )
}