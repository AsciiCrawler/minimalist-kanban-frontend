/* Libraries */
import React, { useContext, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

/* Components */
import { AppContext } from '../context/context';
import { addUser } from '../api/api';
import { AxiosError } from 'axios';

const ComponentNewUserModal = ({ isModalVisible, setIsModalVisible, boardId }: { isModalVisible: boolean; setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>; boardId: string }) => {
    const [username, setUsername] = useState<string>("")
    const { getAllBoards } = useContext(AppContext);
    const [isError, setIsError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>("");

    const createAction = () => {
        if (username === "") {
            setIsError(true);
            setHelperText("Username cannot be empty")
            return;
        }
        addUser(username, boardId).then(result => {
            setIsModalVisible(false);
            setUsername("");
            getAllBoards();
        }).catch((error: AxiosError) => {
            setIsError(true);
            if (error.response?.status === 409)
                setHelperText("This user is already a member of the board");
            else {
                setHelperText("Sorry, something went wrong. Please try again later");
                console.warn(error);
            }
        })
    }

    const cancelAction = () => {
        setIsModalVisible(false);
        setUsername("");
    }

    return (
        <Dialog open={isModalVisible} onClose={() => {
            setIsModalVisible(false);
            setUsername("");
        }}>
            <DialogTitle>Add a new user</DialogTitle>
            <DialogContent>
                <DialogContentText>Please fill out the following fields to add a new user</DialogContentText>
                <TextField
                    fullWidth
                    label="Username"
                    margin='dense'
                    autoFocus
                    variant='standard'
                    error={isError}
                    helperText={isError ? helperText : ""}
                    value={username}
                    onKeyDown={event => { if (event.key === "Enter") createAction(); }}
                    onChange={e => setUsername(e.target.value)}
                >
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='error' onClick={() => { cancelAction(); }}>Cancel</Button>
                <Button disabled={username === ""} variant='contained' color='primary' onClick={() => { createAction(); }}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ComponentNewUserModal;