/* Libraries */
import React, { Fragment, useContext, useState } from 'react';
import { Avatar, Badge, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Paper, Popover } from '@mui/material';

/* Components */
import { AppContext } from '../context/context';
import { stringAvatar } from '../utils/utils';

/* Assets */
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

/* Styles */
import styles from "@/styles/board.module.scss";

const ComponentBoardHeader = () => {
    const { visibleDrawer, setVisibleDrawer, currentBoard, cardFilter, setCardFilter } = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    if (currentBoard == null) return null;

    return (
        <Fragment>
            <Paper variant='outlined' square={true} className={`${styles.headerContainer} flex items-center bg-[#e4e4e4e7]`}>
                <IconButton
                    aria-label='Drawer button Show/Hide'
                    className='ml-2'
                    onClick={() => setVisibleDrawer((e: boolean) => !e)}>
                    {visibleDrawer ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
                </IconButton>

                <Divider orientation='vertical' variant='middle' flexItem className='mx-4' />

                <Badge
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    badgeContent={(() => {
                        if (typeof cardFilter === 'string') return 0;
                        return cardFilter.length;
                    })()}
                    variant='standard'
                    color="primary"
                    className='ml-auto mr-4'
                >
                    <Button onClick={(event) => { setAnchorEl(event.currentTarget); }} variant='outlined' endIcon={<FilterListRoundedIcon />}>
                        Filters
                    </Button>
                </Badge>
            </Paper>

            <Popover
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={() => { setAnchorEl(null); }}
                open={anchorEl != null}
                anchorEl={anchorEl}>
                <List subheader={<ListSubheader>Filter by Member</ListSubheader>}>
                    <ListItem
                        className='min-w-[240px]'
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={async (e) => {
                                    if (e.target.checked === true) {
                                        setCardFilter("ALL");
                                    } else {
                                        setCardFilter(["UNASSIGNED"]);
                                    }
                                }}
                                checked={cardFilter === "ALL"}
                                inputProps={{ 'aria-labelledby': "id" }}
                            />
                        }>
                        <ListItemAvatar>
                            <Avatar {...stringAvatar("All members")} sx={{ width: 36, height: 36, fontSize: 14 }} />
                        </ListItemAvatar>
                        <ListItemText>All members</ListItemText>
                    </ListItem>

                    <Divider className='my-4' />

                    <ListItem
                        className='min-w-[240px]'
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={async (e) => {
                                    if (typeof cardFilter === 'string') {
                                        setCardFilter(["UNASSIGNED"]);
                                        return;
                                    }

                                    let _cardFilter = [...cardFilter];
                                    if (e.target.checked === true)
                                        _cardFilter.push("UNASSIGNED");
                                    else
                                        _cardFilter.splice(_cardFilter.findIndex(e => e === "UNASSIGNED"), 1);

                                    if (_cardFilter.length === 0)
                                        setCardFilter("ALL");
                                    else
                                        setCardFilter(_cardFilter);
                                }}
                                checked={typeof cardFilter !== 'string' && cardFilter.some(cf => cf === "UNASSIGNED")}
                                inputProps={{ 'aria-labelledby': "id" }}
                            />
                        }>
                        <ListItemAvatar>
                            <Avatar {...stringAvatar("Unasigned")} sx={{ width: 36, height: 36, fontSize: 14 }} />
                        </ListItemAvatar>
                        <ListItemText>Unasigned</ListItemText>
                    </ListItem>
                    {currentBoard.users.map((user, index: number) => {
                        return (
                            <ListItem
                                className='min-w-[240px]'
                                key={user._id}
                                secondaryAction={
                                    <Checkbox
                                        key={user._id}
                                        edge="end"
                                        onChange={async (e) => {
                                            if (typeof cardFilter === 'string') {
                                                setCardFilter([user._id]);
                                                return;
                                            }

                                            let _cardFilter = [...cardFilter];
                                            if (e.target.checked === true)
                                                _cardFilter.push(user._id);
                                            else
                                                _cardFilter.splice(_cardFilter.findIndex(e => e === user._id), 1);

                                            if (_cardFilter.length === 0)
                                                setCardFilter("ALL");
                                            else
                                                setCardFilter(_cardFilter);
                                        }}
                                        checked={typeof cardFilter !== "string" && cardFilter.some(e => e === user._id)}
                                        inputProps={{ 'aria-labelledby': "id" }}
                                    />
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
    );
};

export default ComponentBoardHeader;