import { createStyles, makeStyles, Box } from "@material-ui/core";
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
    const styles = useStyles();

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
