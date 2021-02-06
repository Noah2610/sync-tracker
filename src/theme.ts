import purple from "@material-ui/core/colors/purple";
import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
    palette: {
        primary: {
            main: "#315781",
            contrastText: "#cccccc",
        },
        secondary: {
            main: purple[500],
        },
        text: {
            primary: "#dddddd",
            secondary: "#aaaaaa",
        },
        background: {
            default: "#282c34",
            paper: "#282c34",
        },
    },
    typography: {
        fontSize: 14,
    },
});
