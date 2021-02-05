import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

export default createMuiTheme({
    palette: {
        primary: {
            main: "#315781",
        },
        secondary: {
            main: purple[500],
        },
        text: {
            primary: "#cccccc",
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
