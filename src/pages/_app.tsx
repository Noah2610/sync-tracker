import { Container } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider as StoreProvider } from "react-redux";
import Navigation from "../components/navigation";
import muiTheme from "../theme";
import { WsProvider } from "../ws/ws-context";
import SyncWsToStore from "../components/sync-ws-to-store";
import store from "../store";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;400;700&family=Roboto:wght@100;400;900&display=swap"
                />
            </Head>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <StoreProvider store={store}>
                    <WsProvider>
                        <SyncWsToStore />
                        <Navigation />
                        <Container maxWidth="md">
                            <Component {...pageProps} />
                        </Container>
                    </WsProvider>
                </StoreProvider>
            </ThemeProvider>
        </>
    );
}
