import Head from 'next/head';
import IndexLogin from '@/components/auth/indexLogin';

export default function PageLogin() {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='flex justify-center items-center w-screen h-screen' style={{ background: "linear-gradient(315deg, #004b8c 0%, #0074d9 100%)" }}>
                <IndexLogin />
            </main>
        </>
    )
}
