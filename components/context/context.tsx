/* Libraries */
import React, { createContext, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

/* Components */
import { BoardInterface, CardInterface, getAllCardsByBoardId, getBoards, getCardById, UserInterface } from '../api/api';
import io, { Socket } from 'socket.io-client';
import { AxiosError } from 'axios';

export const columnsFromBackend = {
    ["TODO"]: {
        title: 'Todo' as string,
        color: "bg-gray-400" as string,
        items: [] as Array<CardInterface>,
        paperStyle: "border-t-[6px] border-t-gray-400" as string,
        cardStyle: "border-gray-400" as string
    },
    ["IN_PROGRESS"]: {
        title: 'In Progress' as string,
        color: "bg-[#317295]" as string,
        items: [] as Array<CardInterface>,
        paperStyle: "border-t-[6px] border-t-[#317295]" as string,
        cardStyle: "border-[#317295]" as string
    },
    ["TESTING"]: {
        title: 'Testing' as string,
        color: "bg-[#a95d63]" as string,
        items: [] as Array<CardInterface>,
        paperStyle: "border-t-[6px] border-t-[#a95d63]" as string,
        cardStyle: "border-[#a95d63]" as string
    },
    ["DONE"]: {
        title: 'Done' as string,
        color: "bg-[#29a067]" as string,
        items: [] as Array<CardInterface>,
        paperStyle: "border-t-[6px] border-t-[#29a067]" as string,
        cardStyle: "border-[#29a067]" as string
    },
};

export const AppContext = createContext({
    currentCardDelta: null as CardInterface | null,
    setCurrentCardDelta: (value: CardInterface | null) => { },
    currentCard: null as CardInterface | null,
    setCurrentCard: (value: CardInterface | null) => { },
    cards: columnsFromBackend,
    setCards: (value: any) => { },
    getAllCards: () => { },
    boards: [] as Array<BoardInterface>,
    getAllBoards: () => { },

    visibleDrawer: true as boolean,
    setVisibleDrawer: (() => { }) as React.Dispatch<React.SetStateAction<boolean>>,

    currentBoard: null as BoardInterface | null,

    user: null as UserInterface | null,
    setUser: (() => { }) as React.Dispatch<React.SetStateAction<UserInterface | null>>,

    reloadCardCata: (async (section: "ATTACHMENT" | "TITLE" | "COMMENTS" | "ASSIGNED_TO") => { }),

    cardFilter: "ALL" as Array<string> | "ALL",
    setCardFilter: ((value: "ALL" | Array<string>) => { }) as React.Dispatch<React.SetStateAction<"ALL" | string[]>>,

    cleanAll: () => { }
});

export const AppContextProvider = ({ children }: any) => {
    const router = useRouter();
    const { pathname } = router;
    const { boardid } = router.query;
    /* --- --- --- */
    const [visibleDrawer, setVisibleDrawer] = useState<boolean>(true);
    /* --- --- --- */



    /* --- --- --- */
    const [boards, setBoards] = useState<Array<BoardInterface>>([]);
    const [cards, setCards] = useState(columnsFromBackend);

    const [user, setUser] = useState<UserInterface | null>(null);
    const userRef = useRef<UserInterface | null>(null);
    userRef.current = user;
    /* --- --- --- */



    /* --- --- --- */
    const [currentCardDelta, setCurrentCardDelta] = useState<CardInterface | null>(null)
    const [currentCard, setCurrentCard] = useState<CardInterface | null>(null)
    const currentBoard = useMemo(() => {
        if (typeof boardid !== 'string' || boards.length == 0) return null;
        const filteredBoard = boards.filter(e => e._id === boardid);
        if (filteredBoard.length != 1) return null;
        return filteredBoard[0];
    }, [boardid, boards]);
    /* --- --- --- */

    const getAllBoards = () => {
        getBoards().then(result => {
            setBoards(result);
            if (typeof boardid !== 'string') return;
            if (result.some(b => b._id !== boardid)) {
                if (result.length > 0) {
                    router.push("/board?boardid=" + result[0]._id);
                } else {
                    router.push("/board");
                }
            }
        }).catch((error: AxiosError) => {
            console.warn(error);
        })
    }

    const [cardFilter, setCardFilter] = useState<"ALL" | Array<string>>("ALL");
    const getAllCards = () => {
        if(typeof boardid !== 'string') return;

        getAllCardsByBoardId(boardid).then(cards => {
            let _columnsFromBackend = { ...columnsFromBackend };
            _columnsFromBackend.TODO.items = cards.filter(e => e.state == "TODO").sort((a, b) => a.index - b.index);
            _columnsFromBackend.IN_PROGRESS.items = cards.filter(e => e.state == "IN_PROGRESS").sort((a, b) => a.index - b.index);
            _columnsFromBackend.TESTING.items = cards.filter(e => e.state == "TESTING").sort((a, b) => a.index - b.index);
            _columnsFromBackend.DONE.items = cards.filter(e => e.state == "DONE").sort((a, b) => a.index - b.index);
            setCards(_columnsFromBackend);
        }).catch((error: AxiosError) => {
            console.warn(error);
        })
    }

    const reloadCardCata = async (section: "ATTACHMENT" | "TITLE" | "COMMENTS" | "ASSIGNED_TO" | "DESCRIPTION") => {
        if (currentCard == null || currentCardDelta == null) return;
        await getCardById(currentCard._id).then(data => {
            switch (section) {
                case 'ATTACHMENT': {
                    setCurrentCard({ ...currentCard, attachments: data.attachments });
                    setCurrentCardDelta({ ...currentCardDelta, attachments: data.attachments });
                } return;

                case 'TITLE': {
                    setCurrentCard({ ...currentCard, title: data.title });
                    setCurrentCardDelta({ ...currentCardDelta, title: data.title });
                } return;

                case 'DESCRIPTION': {
                    setCurrentCard({ ...currentCard, description: data.description });
                    setCurrentCardDelta({ ...currentCardDelta, description: data.description });
                } return;

                case 'ASSIGNED_TO': {
                    setCurrentCard({ ...currentCard, assignedTo: data.assignedTo });
                    setCurrentCardDelta({ ...currentCardDelta, assignedTo: data.assignedTo });
                } return;


                case 'COMMENTS': {
                    setCurrentCard({ ...currentCard, comments: data.comments });
                    setCurrentCardDelta({ ...currentCardDelta, comments: data.comments });
                } return;

                case 'ASSIGNED_TO': {
                    setCurrentCard({ ...currentCard, assignedTo: data.assignedTo });
                    setCurrentCardDelta({ ...currentCardDelta, assignedTo: data.assignedTo });
                } return;

                default: console.warn("section doesn't exists"); break;
            }
        }).catch((error: AxiosError) => {
            console.warn(error);
        })
    }

    /* --- */

    /* Websockets */
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (pathname !== "/board") {
            if (socket != null) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        if (socket == null) {
            const token = localStorage.getItem("LOGIN_JWT");
            setSocket(io((process.env.NEXT_PUBLIC_WS as string) + "?jwt=" + token));
        }
    }, [pathname])

    /* useEffect(() => {
        console.log({sock: socket == null});
        if(socket != null) { 
            socket.emit("auth", {})
        }
    }, [socket]) */

    /* Websockets */
    const [socketBoardId, setSocketBoardId] = useState<string>("");
    useEffect(() => {
        if (socket == null || typeof boardid !== 'string') return;

        setSocketBoardId(boardid + "_UPDATE");
        socket.removeListener(socketBoardId);
        socket.removeListener(boardid + "_UPDATE");
        socket.on(boardid + "_UPDATE", (data) => {
            if (userRef.current == null || data.sender === userRef.current._id) return;
            getAllCards();
        });
    }, [boardid, boards, socket])

    /* Websockets */
    const [socketCardId, setSocketCardId] = useState<string>("");
    useEffect(() => {
        if (socket == null || typeof boardid !== 'string' || currentCard == null) return;

        setSocketCardId(currentCard._id + "_UPDATE");
        socket.removeListener(socketCardId);
        socket.removeListener(currentCard._id + "_UPDATE");
        socket.on(currentCard._id + "_UPDATE", (data) => {
            if (userRef.current == null || data.sender === userRef.current._id) return;
            reloadCardCata(data.section);
        });
    }, [boardid, currentCard])


    useEffect(() => {
        setCardFilter("ALL");

        /* Websockets */
        if (socket == null || typeof boardid !== 'string') return;
        socket.emit("onBoardChange", boardid);
    }, [boardid])

    const cleanAll = () => {
        setCardFilter("ALL");
        setCurrentCard(null);
        setCurrentCardDelta(null);
        setUser(null);

        const _cards = { ...cards };
        _cards.DONE.items = [];
        _cards.IN_PROGRESS.items = [];
        _cards.TESTING.items = [];
        _cards.TODO.items = [];
        setCards(_cards);
        setBoards([]);
        setVisibleDrawer(true);
    }

    return <AppContext.Provider value={{
        visibleDrawer, setVisibleDrawer,
        /*  */
        currentCardDelta, setCurrentCardDelta,
        currentCard, setCurrentCard,
        /*  */


        /*  */
        user, setUser,
        cards, setCards,
        boards,
        currentBoard,
        /*  */


        /*  */
        getAllCards,
        getAllBoards,
        reloadCardCata: reloadCardCata,

        setCardFilter, cardFilter,

        cleanAll: cleanAll
    }}>{
            <Fragment>
                {children}
            </Fragment>
        }
    </AppContext.Provider>;
}