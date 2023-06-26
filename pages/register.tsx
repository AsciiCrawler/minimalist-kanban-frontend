import Head from 'next/head';
import IndexRegister from '@/components/auth/indexRegister';

export default function PageRegister() {
    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="description" content="Register" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='flex justify-center items-center w-screen h-screen' style={{ background: "linear-gradient(315deg, #004b8c 0%, #0074d9 100%)" }}>
                <IndexRegister />
            </main>
        </>
    )
}
