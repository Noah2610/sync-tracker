import { AppProps } from "next/app";
import Head from "next/head";
import { Container } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider as StoreProvider } from "react-redux";
import store from "../store";
import SyncFirebaseToStore from "../firebase/sync-firebase-to-store";
import muiTheme from "../theme";
import Navigation from "../components/navigation";

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

            <StoreProvider store={store}>
                <SyncFirebaseToStore />
                <ThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <Navigation />
                    <Container maxWidth="md">
                        <Component {...pageProps} />
                    </Container>
                </ThemeProvider>
            </StoreProvider>
        </>
    );
}
