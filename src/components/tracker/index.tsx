import { createStyles, makeStyles, Box } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import PatternSelect from "./pattern-select";
import TrackerGrid from "./tracker-grid";

const useStyles = makeStyles((_theme) =>
    createStyles({
        root: {
            display: "flex",
            justifyContent: "center",
        },
        grid: {},
        patternList: {
            width: 128,
        },
    }),
);

export default function Tracker() {
    const [user] = useAuthState(auth);
    const styles = useStyles();

    if (!user) {
        return null;
    }

    return (
        <Box className={styles.root}>
            <Box className={styles.grid}>
                <TrackerGrid />
            </Box>

            <Box className={styles.patternList}>
                <PatternSelect />
            </Box>
        </Box>
    );
}
