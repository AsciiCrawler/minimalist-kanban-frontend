/* Libraries */
import axios from "axios";

export interface UserInterface {
    _id: string;
    username: string;
    lowercaseUsername: string;
    role?: string;
};

export interface PendingsInterface {
    _id: string,
    username: UserInterface & { role: string },
    creator: UserInterface,
    title: string
}
export interface BoardInterface {
    title: string;
    creator: UserInterface;
    _id: string;
    users: Array<UserInterface>
};

export interface AttachmentInterface {
    _id: string;
    creationDate: Date;
    user: UserInterface;
    url: string
}

export interface CardCommentInterface {
    _id: string;
    creationDate: Date;
    comment: string;
    creator: UserInterface
}

export interface CardInterface {
    title: string;
    state: string;
    description: string;
    _id: string;
    index: number;
    assignedTo: Array<UserInterface>;
    comments: Array<CardCommentInterface>
    startDate: Date;
    endDate: Date;
    attachments: Array<AttachmentInterface>
};

export interface CardUpdateCardBodyDto {
    name?: string | null;
    description?: string | null;
    /* assignedTo: Array<UserModelDto> | null; */
}

/* --- */
/* --- */
/* --- */

export const getProfile = () => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.get<UserInterface>(`${process.env.NEXT_PUBLIC_URL}/user/profile`, {
        headers: { Authorization: "bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const isUsernameAvailable = (username: string) => {
    return axios.get<{ isAvailable: boolean }>(`${process.env.NEXT_PUBLIC_URL}/user/is-username-available/${username}`).then(({ data }) => {
        return data;
    });
}

export const isUserLoggedIn = () => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<boolean>(`${process.env.NEXT_PUBLIC_URL}/user/is-user-logged-in`, {}, { headers: { Authorization: "Bearer " + token } }).then(({ data }) => {
        return true;
    }).catch(() => {
        return false;
    });
}

export const login = ({ username, password }: { username: string, password: string }) => {
    return axios.post<{ token: string }>(`${process.env.NEXT_PUBLIC_URL}/user/login`, {
        "username": username,
        "password": password
    }).then(({ data }) => {
        return data.token;
    })
}

export const register = ({ username, password, uuid, phone }: { username: string, password: string, uuid: string, phone: string }) => {
    return axios.post(`${process.env.NEXT_PUBLIC_URL}/user/create`, {
        username,
        password,
        uuid,
        phone
    }).then(({ data }) => {
        return data.token;
    })
}

export const logout = async () => {
    return new Promise<number>((resolve) => {
        localStorage.removeItem("LOGIN_JWT");
        resolve(200);
    });
}

/* --- */
/* --- */
/* --- */

export const generateCaptcha = () => {
    return axios.post<{ url: string; uuid: string; }>(`${process.env.NEXT_PUBLIC_URL}/captcha/generate-captcha`, {}).then(({ data }) => {
        return data;
    });
}

export const renewCaptcha = (uuid: string) => {
    return axios.post<{ url: string; }>(`${process.env.NEXT_PUBLIC_URL}/captcha/renew-captcha/${uuid}`, {}).then(({ data }) => {
        return data;
    });
}

export const validateCaptcha = (uuid: string, code: string) => {
    return axios.post<{ code: number }>(`${process.env.NEXT_PUBLIC_URL}/captcha/validate-captcha/${uuid}`, { code: code }).then(() => {
        return;
    });
}

/* --- */
/* --- */
/* --- */

export const getBoards = () => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.get<Array<BoardInterface>>(`${process.env.NEXT_PUBLIC_URL}/board/get-all`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const getAllPendingRole = () => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.get<Array<PendingsInterface>>(`${process.env.NEXT_PUBLIC_URL}/board/get-all-pending-role`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const createBoard = (title: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<{ boardId: string }>(`${process.env.NEXT_PUBLIC_URL}/board/create`, {
        "title": title
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const removeUser = ({ boardId, userId }: { boardId: string; userId: string }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<void>(`${process.env.NEXT_PUBLIC_URL}/board/remove-user`, {
        boardId, userId
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const changePendingRoleToUser = ({ boardId }: { boardId: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<void>(`${process.env.NEXT_PUBLIC_URL}/board/change-pending-role-to-user`, {
        boardId
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const addUser = (userName: string, boardId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/board/add-user`, {
        userName: userName,
        boardId: boardId
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const deleteBoard = (boardId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.delete<void>(`${process.env.NEXT_PUBLIC_URL}/board/delete/${boardId}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

/* --- */
/* --- */
/* --- */

export const getCardById = (cardId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.get<CardInterface>(`${process.env.NEXT_PUBLIC_URL}/card/get-by-id/${cardId}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const getAllCardsByBoardId = (boardId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.get<Array<CardInterface>>(`${process.env.NEXT_PUBLIC_URL}/card/get-by-board-id/${boardId}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const createNewCard = ({ boardId, title, description, state }: { boardId: string, title: string, description: string, state: string }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<CardInterface>(`${process.env.NEXT_PUBLIC_URL}/card/create`, {
        "boardId": boardId,
        "title": title,
        "description": description,
        "state": state
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const postComment = ({ cardId, comment }: { cardId: string; comment: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/card/post-comment/${cardId}`, {
        comment
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const updateTitle = ({ cardId, title }: { cardId: string; title: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/card/update-title`, { cardId, title }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const updateDescription = ({ cardId, description }: { cardId: string; description: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/card/update-description`, { cardId, description }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const deleteComment = ({ cardId, commentId }: { cardId: string; commentId: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.delete(`${process.env.NEXT_PUBLIC_URL}/card/delete-comment/${cardId}/${commentId}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const deleteCard = ({ cardId }: { cardId: string; }) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.delete(`${process.env.NEXT_PUBLIC_URL}/card/delete/${cardId}`, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const attachFile = (url: string, cardId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/card/attatch-file`, {
        url: url,
        cardId: cardId
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const deleteFile = (cardId: string, attachmentId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put(`${process.env.NEXT_PUBLIC_URL}/card/delete-file`, {
        attachmentId: attachmentId,
        cardId: cardId
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const batchUpdateIndexAndState = (cards: any) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put<any>(`${process.env.NEXT_PUBLIC_URL}/card/batch-update-index-and-state`, {
        cards: cards
    }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const assignUser = (cardId: string, userId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put<any>(`${process.env.NEXT_PUBLIC_URL}/card/assign-user`, { cardId, userId }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const unassignUser = (cardId: string, userId: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.put<any>(`${process.env.NEXT_PUBLIC_URL}/card/unassign-user`, { cardId, userId }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

/* --- */
/* --- */
/* --- */

export const fileUpload = ({ form, contentType, signedUrl }: { form: File, contentType: string, signedUrl: string }) => {
    return axios({
        url: signedUrl,
        method: "put",
        headers: { 'Content-Type': contentType },
        data: form
    });
}

export const getSignedUrl = (mimeType: string, contentLength: number) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<{ signedUrl: string, fileUUID: string }>(`${process.env.NEXT_PUBLIC_URL}/file/get-signed-url`, { mimeType, contentLength }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

export const processFile = (uuid: string) => {
    const token = localStorage.getItem("LOGIN_JWT");
    return axios.post<{ url: string }>(`${process.env.NEXT_PUBLIC_URL}/file/process-file`, { uuid }, {
        headers: { Authorization: "Bearer " + token }
    }).then(({ data }) => {
        return data;
    })
}

/* --- */
/* --- */
/* --- */
/* --- */
/* --- */
/* --- */
// SANDBOX
/* --- */
/* --- */
/* --- */
/* --- */
/* --- */
/* --- */



