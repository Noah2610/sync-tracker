import Head from "next/head";
import type { AppProps } from "next/app";
import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core";
import { WsProvider } from "../ws/ws-context";
import Navigation from "../components/navigation";
import muiTheme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </Head>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <WsProvider>
                    <Navigation />
                    <Container maxWidth="md">
                        <Component {...pageProps} />
                    </Container>
                </WsProvider>
            </ThemeProvider>
        </>
    );
}
