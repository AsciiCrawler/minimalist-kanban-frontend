/* Libraries */
import { Alert, AlertTitle, Button, Portal, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";

/* Components */
import { PendingsInterface, changePendingRoleToUser, getAllPendingRole, removeUser } from "../api/api";
import { AppContext } from "../context/context";
import { AxiosError } from "axios";

const ComponentPendingCards = () => {
    const { getAllBoards } = useContext(AppContext);
    const [pendings, setPendings] = useState<Array<PendingsInterface>>([]);

    const refresh = () => {
        getAllPendingRole().then(result => {
            setPendings(result);
        }).catch((error: AxiosError) => {
            console.warn(error);
        })
    }

    useEffect(() => {
        refresh();
    }, []);

    if (pendings.length == 0) return null;
    return (
        <Portal >
            <div className='flex justify-end items-end fixed top-0 left-0 w-screen h-screen'>
                <Stack className='pb-8 pr-8'>
                    {pendings.map((e: PendingsInterface, index: number) => {
                        return (
                            <Alert
                                key={index}
                                action={
                                    <div className="flex ml-12 h-full justify-end items-end">
                                        <Button
                                            onClick={() => {
                                                removeUser({ boardId: e._id, userId: e.username._id }).then(() => {
                                                    refresh();
                                                }).catch((error: AxiosError) => {
                                                    console.warn(error);
                                                });
                                            }}
                                            className="mx-4" sx={{ color: "white" }} variant="text">
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                changePendingRoleToUser({ boardId: e._id }).then(() => {
                                                    refresh();
                                                    getAllBoards();
                                                }).catch((error: AxiosError) => {
                                                    console.warn(error);
                                                });
                                            }}
                                            className="mx-4" variant="contained" color="primary">
                                            Accept
                                        </Button>
                                    </div>
                                }
                                variant="filled"
                                className="drop-shadow-lg my-2"
                                severity='info'>
                                <AlertTitle>
                                    <span> <span className="font-bold">{e.creator.username}</span>  has invited you to <span className="font-bold">{e.title}</span></span>
                                </AlertTitle>
                                <span className="opacity-0">-</span>
                            </Alert>
                        );
                    })}
                </Stack>
            </div>
        </Portal>
    );
};

export default ComponentPendingCards;