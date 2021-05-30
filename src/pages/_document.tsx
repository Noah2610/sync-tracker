import React from "react";
import Document, {
    DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";

import muiTheme from "../theme";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) =>
                    sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                ...React.Children.toArray(initialProps.styles),
                sheets.getStyleElement(),
            ],
        };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;400;700&family=Roboto:wght@100;400;900&display=swap"
                    />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
