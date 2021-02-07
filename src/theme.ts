import purple from "@material-ui/core/colors/purple";
import { createMuiTheme } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

type CssColor = React.CSSProperties["color"];

interface TrackerColorOptions {
    main: CssColor;
    alt?: CssColor;
}

interface TrackerTheme {
    colors: {
        cells: {
            note: TrackerColorOptions;
            even: TrackerColorOptions;
            odd: TrackerColorOptions;
            border: TrackerColorOptions;
        };
    };
}

declare module "@material-ui/core/styles/createMuiTheme" {
    interface Theme {
        tracker: TrackerTheme;
    }
    interface ThemeOptions {
        tracker: TrackerTheme;
    }
}

interface Colors {
    [name: string]: string;
}

const COLORS: Colors = {
    primary: "#315781",
    secondary: purple[500],
    background: "#282c34",
};

export default createMuiTheme({
    palette: {
        primary: {
            main: COLORS.primary,
            contrastText: "#cccccc",
        },
        secondary: {
            main: COLORS.secondary,
        },
        text: {
            primary: "#dddddd",
            secondary: "#aaaaaa",
        },
        background: {
            default: COLORS.background,
            paper: COLORS.background,
        },
    },
    tracker: {
        colors: {
            cells: {
                note: {
                    main: COLORS.primary,
                },
                even: {
                    main: "#343182",
                },
                odd: {
                    main: "#317f82",
                },
                border: {
                    main: "#000000",
                    alt: "#ffffff",
                },
            },
        },
    },
    typography: {
        fontSize: 14,
        fontFamily: "Roboto",
    },
});
