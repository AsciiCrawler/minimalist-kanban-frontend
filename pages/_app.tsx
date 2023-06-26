import '@/styles/globals.css';
import '@/styles/tiptap.css';
import { AppContextProvider } from '@/components/context/context'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GA_TRACKING_ID, pageview } from '@/components/utils/utils';

declare module '@mui/material' {
    interface Palette {
        gray?: Palette['primary'];
    }
    interface PaletteOptions {
        gray?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#2f80ed"
        },
        gray: {
            main: "gray"
        }
    }
})

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            pageview(url)
        }
        router.events.on("routeChangeComplete", handleRouteChange)
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange)
        }
    }, [router.events])

    return (
        <ThemeProvider theme={theme}>
            <AppContextProvider>
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <Script
                    id="gtag-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });`,
                    }}
                />
                <Component {...pageProps} />
            </AppContextProvider>
        </ThemeProvider>
    );
}
