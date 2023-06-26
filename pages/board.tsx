import IndexBoard from '@/components/board';
import Head from 'next/head';
export default function PageBoard() {
    return (
        <>
            <Head>
                <title>Board</title>
                <meta name="description" content="Board" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <IndexBoard />
        </>
    )
}
