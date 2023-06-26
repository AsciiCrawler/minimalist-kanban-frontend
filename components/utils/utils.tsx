import { useEffect, useState } from "react";

export const stringAvatar = (name: string, size?: number, fontSize?: number) => {
    const stringToColor = (string: string) => {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    const getName = () => {
        try {
            return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
        } catch (error) {
            return name[0].toUpperCase();
        }
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
            width: size,
            height: size,
            fontSize: fontSize
        },
        children: getName(),
    };
}

export const GA_TRACKING_ID = "G-R9K3X5RT1C" //replace it with your measurement id
export const pageview = (url: string) => {
    window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    })
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState<{ width: number, height: number }>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        if (typeof window == 'undefined') {
            return;
        }

        window.addEventListener("resize", handleResize);
        handleResize();



        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}