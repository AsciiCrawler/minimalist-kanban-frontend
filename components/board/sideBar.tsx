/* Libraries */
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Accordion, AccordionSummary, Avatar, Button, CircularProgress, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Popover, ThemeProvider, Typography, createTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

/* Components */
import { AppContext } from '../context/context';
import { BoardInterface, UserInterface, deleteBoard, logout, removeUser } from '../api/api';
import ComponentNewBoardModal from './newBoardModal';
import ComponentNewUserModal from './newUserModal';

/* Assets */
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

/* Styles */
import styles from "@/styles/board.module.scss";
import { AxiosError } from 'axios';
import { useWindowSize } from '../utils/utils';


const theme = createTheme({
    components: {
        MuiDrawer: {
            styleOverrides: {
                root: {
                    zIndex: 0
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    fontWeight: "bold"
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    fontWeight: "bold"
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    color: "rgba(0, 0, 0, 0.7)",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    "&.Mui-selected": {
                        borderRight: "solid",
                        backgroundColor: "#e6f7ff96",
                        borderRightColor: "#1890ff",
                        borderRightWidth: "2px",
                        color: "rgb(24, 144, 255)"
                    },
                    ":hover": {
                        backgroundColor: "#eff8fc96"
                    }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    '&.MuiListItemText-primary': {
                        fontSize: "10px",
                    }
                },
                primary: {
                    fontSize: '14px',
                    lineHeight: "0.8rem"
                }
            }
        }
    }
});

const ComponentBoardSideBar = () => {
    const router = useRouter();
    const size = useWindowSize();

    const { boardid } = router.query;
    const { boards, currentBoard, visibleDrawer, setVisibleDrawer, user, cleanAll } = useContext(AppContext);

    const [isNewBoardModalVisible, setIsNewBoardModalVisible] = useState<boolean>(false);
    const [isNewUserModalVisible, setIsNewUserModalVisible] = useState<boolean>(false);

    const [boardPopover, setBoardPopover] = useState<{ boardId: string, anchorEl: HTMLButtonElement | null }>({
        boardId: "",
        anchorEl: null
    });

    const [userPopover, setUserPopover] = useState<{ boardId: string, userId: string; anchorEl: HTMLButtonElement | null }>({
        boardId: "",
        userId: "",
        anchorEl: null
    });

    useEffect(() => {
        if(size.width === 0) return;
        if(size.width < 720) { 
            setVisibleDrawer(false);
        } else { 
            setVisibleDrawer(true);
        }
    }, [size.width])

    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <Drawer
                    className={`${styles.boardSideBarContainer}`}
                    sx={{
                        transition: "width 200ms ease",
                        width: visibleDrawer ? "240px" : "0px",
                        '& .MuiDrawer-paper': {
                            backgroundColor: "#e4e4e4e7",
                            transition: "width 200ms ease",
                            width: "240px"
                        }
                    }}
                    variant={size.width < 720 ? 'temporary' : 'persistent'}
                    anchor='left'
                    onClose={() => { setVisibleDrawer(false); }}
                    open={visibleDrawer}>
                    <div className='flex flex-col items-center py-4'>
                        <span className='pb-2'>
                            <Avatar sx={{ width: 80, height: 80, lineHeight: 0 }}>T</Avatar>
                        </span>
                        <span className='font-bold text-sm'>{user?.username ?? "---"}</span>
                        <Button
                            className='mt-2'
                            size='small'
                            endIcon={<LogoutRoundedIcon />}
                            onClick={() => {
                                logout().then(() => {
                                    cleanAll();
                                    router.push("/");
                                }).catch((error: AxiosError) => { console.warn(error); })
                            }}
                            variant='outlined'
                            color='error'
                        >Log out</Button>
                    </div>

                    <Accordion defaultExpanded={true} variant='outlined'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Boards</Typography>
                        </AccordionSummary>
                        <List >
                            {boards.map((e: BoardInterface) => {
                                return (
                                    <Fragment key={e._id}>
                                        <Link href={`board?boardid=${e._id}`}>
                                            <ListItem
                                                secondaryAction={
                                                    user?._id === e.creator._id ?
                                                        <IconButton
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                event.preventDefault();
                                                                setBoardPopover({ ...boardPopover, boardId: e._id, anchorEl: event.currentTarget });
                                                            }}>
                                                            <SettingsRoundedIcon color='primary' />
                                                        </IconButton> : null
                                                }>
                                                <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                                                    <DashboardRoundedIcon htmlColor={boardid == e._id ? "rgb(24, 144, 255)" : "gray"} />
                                                </ListItemIcon>
                                                <ListItemText sx={{ color: boardid == e._id ? "rgb(24, 144, 255)" : "gray" }} primaryTypographyProps={{ fontWeight: boardid == e._id ? "bold" : "normal" }} primary={e.title} />
                                            </ListItem>
                                        </Link>
                                        <Divider variant='middle' />
                                    </Fragment>
                                );
                            })}

                            <ListItemButton onClick={() => {
                                setIsNewBoardModalVisible(true);
                            }}>
                                <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                                    <DashboardCustomizeRoundedIcon color='action' className='mr-2' />
                                </ListItemIcon>
                                <ListItemText primary={"Create new board"} />
                            </ListItemButton>
                        </List>
                    </Accordion>

                    {currentBoard != null && user != null &&
                        <Accordion defaultExpanded={true} variant='outlined'>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Users</Typography>
                            </AccordionSummary>
                            <List >
                                {currentBoard.users.map((u: UserInterface) => {
                                    return (
                                        <Fragment key={u._id}>
                                            <ListItem
                                                secondaryAction={
                                                    ((() => {
                                                        const userInBoard = currentBoard.users.find(f => f._id === user._id);
                                                        if (userInBoard == null) return false;

                                                        if (u._id === userInBoard._id && userInBoard.role != "CREATOR")
                                                            return true;

                                                        if (u._id !== userInBoard._id && userInBoard.role === "CREATOR")
                                                            return true;

                                                        return false;
                                                    })()) ? <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();
                                                            setUserPopover({ ...boardPopover, boardId: currentBoard._id, anchorEl: event.currentTarget, userId: u._id })
                                                        }}>
                                                        <SettingsRoundedIcon />
                                                    </IconButton> : null

                                                }>
                                                <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                                                    <PersonRoundedIcon htmlColor={boardid == u._id ? "rgb(24, 144, 255)" : "gray"} />
                                                </ListItemIcon>
                                                <ListItemText sx={{ color: boardid == u._id ? "rgb(24, 144, 255)" : "gray" }} primaryTypographyProps={{ fontWeight: boardid == u._id ? "bold" : "normal" }} primary={u.username} />
                                            </ListItem>
                                            <Divider variant='middle' />
                                        </Fragment>
                                    );
                                })}

                                <ListItemButton onClick={() => {
                                    setBoardPopover({ ...boardPopover, boardId: currentBoard._id, anchorEl: null })
                                    setIsNewUserModalVisible(true);
                                }}>
                                    <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                                        <PersonAddRoundedIcon color='action' className='mr-2' />
                                    </ListItemIcon>
                                    <ListItemText primary={"Add new user"} />
                                </ListItemButton>
                            </List>
                        </Accordion>
                    }
                </Drawer>
            </ThemeProvider >

            <ComponentUserPopover userPopover={userPopover} setUserPopover={setUserPopover} />
            <ComponentBoardPopover setIsNewUserModalVisible={setIsNewUserModalVisible} boardPopover={boardPopover} setBoardPopover={setBoardPopover} />
            <ComponentNewBoardModal isModalVisible={isNewBoardModalVisible} setIsModalVisible={setIsNewBoardModalVisible} />
            <ComponentNewUserModal boardId={boardPopover.boardId} isModalVisible={isNewUserModalVisible} setIsModalVisible={setIsNewUserModalVisible} />
        </Fragment >
    );
};

export default ComponentBoardSideBar;

function ComponentBoardPopover({ boardPopover, setBoardPopover, setIsNewUserModalVisible }: {
    boardPopover: {
        boardId: string;
        anchorEl: HTMLButtonElement | null;
    }; setBoardPopover: React.Dispatch<React.SetStateAction<{
        boardId: string;
        anchorEl: HTMLButtonElement | null;
    }>>;
    setIsNewUserModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { getAllBoards } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmDeleteBoard, setConfirmDeleteBoard] = useState<boolean>(false);

    return (
        <Popover
            open={boardPopover.anchorEl != null}
            anchorEl={boardPopover.anchorEl}
            onClose={() => {
                if (isLoading == true) return;
                setConfirmDeleteBoard(false);
                setBoardPopover({ ...boardPopover, anchorEl: null });
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <List
                subheader={<ListSubheader>
                    Board options
                </ListSubheader>}
            >
                <ListItemButton onClick={() => {
                    setBoardPopover({ ...boardPopover, anchorEl: null });
                    setIsNewUserModalVisible(true);
                }}>
                    <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                        <PersonAddAltRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add new user"></ListItemText>
                </ListItemButton>

                <ListItemButton onClick={() => {
                    if (confirmDeleteBoard == false) {
                        setConfirmDeleteBoard(true);
                        return;
                    }

                    setIsLoading(true);
                    deleteBoard(boardPopover.boardId).then(() => {
                        setBoardPopover({ ...boardPopover, anchorEl: null });
                        setConfirmDeleteBoard(false);
                        getAllBoards();
                    }).catch((error: AxiosError) => {
                        console.warn(error);
                    }).finally(() => {
                        setIsLoading(false);
                    });
                }}>
                    <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                        {isLoading == false && <DeleteForeverRoundedIcon htmlColor={confirmDeleteBoard ? "#d53b3b" : ""} />}
                        {isLoading == true && <CircularProgress size={20} color='error' />}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: confirmDeleteBoard ? "#d53b3b" : "rgba(0, 0, 0, 0.7)", fontWeight: confirmDeleteBoard ? "bold" : "normal" }} primary={confirmDeleteBoard == true ? "Confirm deletion" : "Delete"}></ListItemText>
                </ListItemButton>
            </List>
        </Popover>
    );
}

function ComponentUserPopover({ userPopover, setUserPopover }: {
    userPopover: {
        boardId: string;
        anchorEl: HTMLButtonElement | null;
        userId: string;
    }; setUserPopover: React.Dispatch<React.SetStateAction<{
        boardId: string;
        anchorEl: HTMLButtonElement | null;
        userId: string;
    }>>;
}) {
    const { getAllBoards, user } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmDeleteBoard, setConfirmDeleteBoard] = useState<boolean>(false);

    if (user == null) return null;

    return (
        <Popover
            open={userPopover.anchorEl != null}
            anchorEl={userPopover.anchorEl}
            onClose={() => {
                if (isLoading == true) return;
                setConfirmDeleteBoard(false);
                setUserPopover({ ...userPopover, anchorEl: null });
            }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <List
                subheader={<ListSubheader>
                    User options
                </ListSubheader>}
            >
                <ListItemButton onClick={() => {
                    if (confirmDeleteBoard == false) {
                        setConfirmDeleteBoard(true);
                        return;
                    }

                    setIsLoading(true);
                    removeUser({ boardId: userPopover.boardId, userId: userPopover.userId }).then(() => {
                        setUserPopover({ ...userPopover, anchorEl: null });
                        setConfirmDeleteBoard(false);
                        getAllBoards();
                    }).catch((error: AxiosError) => {
                        console.warn(error);
                    }).finally(() => {
                        setIsLoading(false);
                    });
                }}>
                    <ListItemIcon sx={{ paddingRight: "10px", minWidth: "fit-content" }}>
                        {isLoading == false && <DeleteForeverRoundedIcon htmlColor={confirmDeleteBoard ? "#d53b3b" : ""} />}
                        {isLoading == true && <CircularProgress size={20} color='error' />}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: confirmDeleteBoard ? "#d53b3b" : "rgba(0, 0, 0, 0.7)", fontWeight: confirmDeleteBoard ? "bold" : "normal" }} primary={confirmDeleteBoard == true ? (user._id === userPopover.userId ? "Confirm action" : "Confirm delete") : (user._id === userPopover.userId ? "Leave board" : "Delete")}></ListItemText>
                </ListItemButton>
            </List>
        </Popover>
    );
}
