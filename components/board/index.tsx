/* Libraries */
import { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

/* Components */
import ComponentBoard from '@/components/board/board';
import ComponentBoardSideBar from './sideBar';
import ComponentBoardHeader from './header';
import ComponentPendingCards from './pendingCards';
import { AppContext } from '../context/context';
import { getProfile, isUserLoggedIn } from '../api/api';

/* Styles */
import styles from '@/styles/board.module.scss';
import { AxiosError } from 'axios';

const ComponentBoardCardModal = dynamic(() => import("@/components/board/cardModal"), { ssr: false });
const IndexBoard = () => {
    const { getAllCards, getAllBoards, boards, setUser } = useContext(AppContext);
    const router = useRouter();
    const { boardid } = router.query;

    useEffect(() => {
        if (boards.length == 0) return;
        if (typeof boardid !== 'string')
            router.push("/board?boardid=" + boards[0]._id);
    }, [boards])

    useEffect(() => {
        if (typeof boardid === 'string')
            getAllCards();
    }, [boardid])

    useEffect(() => {
        getProfile().then(user => {
            setUser(user);
        }).catch((error: AxiosError) => {
            console.warn(error);
        });

        isUserLoggedIn().then((response) => {
            if (response == false)
                router.push("/");
        }).catch((error) => {
            router.push("/");
        });

        getAllBoards();
    }, [])

    return (
        <main className={`${styles.mainContainer} h-screen w-screen relative bg-cover bg-center bg-[url('/background-flat2.jpg')]`}>
            <ComponentBoardSideBar />
            <ComponentBoardHeader />
            <ComponentBoard />
            <ComponentPendingCards />
            <ComponentBoardCardModal />
        </main >
    )
}

export default IndexBoard;
