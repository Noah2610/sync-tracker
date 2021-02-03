import type { AppProps } from "next/app";
import { WsProvider } from "../ws/ws-context";

import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <WsProvider>
                <Component {...pageProps} />
            </WsProvider>
        </>
    );
}
