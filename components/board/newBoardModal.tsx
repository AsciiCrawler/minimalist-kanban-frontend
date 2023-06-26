/* Libraries */
import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';

/* Components */
import { AppContext } from '../context/context';
import { createBoard } from '../api/api';
import { AxiosError } from 'axios';

const ComponentNewBoardModal = ({ isModalVisible, setIsModalVisible }: { isModalVisible: boolean; setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const router = useRouter();
    const [name, setName] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false);
    const { getAllBoards } = useContext(AppContext);

    const createAction = () => {
        if (name === "") {
            setIsError(true);
            return;
        }

        createBoard(name).then(result => {
            getAllBoards();
            router.replace({
                query: { ...router.query, boardid: result.boardId }
            });
        }).catch((error: AxiosError) => {
            console.warn(error);
        })

        setIsModalVisible(false);
        setName("");
    }

    const cancelAction = () => {
        setIsModalVisible(false);
        setName("");
    }

    return (
        <Dialog open={isModalVisible} onClose={() => {
            setIsModalVisible(false);
            setName("");
        }}>
            <DialogTitle>Create a new board</DialogTitle>
            <DialogContent>
                <DialogContentText>Please fill out the following fields to create a new board</DialogContentText>
                <TextField
                    fullWidth
                    label="Board name"
                    margin='dense'
                    autoFocus
                    variant='standard'
                    value={name}
                    error={isError}
                    helperText={isError ? "Name cannot be empty" : ""}
                    onKeyDown={event => { if (event.key === "Enter") createAction(); }}
                    onChange={e => { setName(e.target.value); setIsError(false); }}
                >
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='error' onClick={() => { cancelAction(); }}>Cancel</Button>
                <Button disabled={name === ""} variant='contained' color='primary' onClick={() => { createAction(); }}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ComponentNewBoardModal;