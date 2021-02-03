import type { AppProps } from "next/app";
import { WsProvider } from "../ws/ws-context";
import Navigation from "../components/navigation";

import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <WsProvider>
                <Navigation />
                <Component {...pageProps} />
            </WsProvider>
        </>
    );
}
