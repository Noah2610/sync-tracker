import clsx from "clsx";
import { Box, Typography, createStyles, makeStyles } from "@material-ui/core";

type BeatVariant = "bar" | "quarter" | "sixteenth";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        beat: {
            fontSize: 16,
        },
        beatBar: {
            fontWeight: "bold",
        },
        beatQuarter: {
            fontWeight: "bold",
        },
    }),
);

export interface BeatDisplayProps {
    beat: number;
    beatsPerBar?: number;
}

export default function BeatDisplay({
    beat,
    beatsPerBar = 16,
}: BeatDisplayProps) {
    const styles = useStyles();

    return (
        <Box className={styles.root}>
            <Typography
                className={clsx(styles.beat, {
                    [styles.beatBar]: beat % beatsPerBar === 0,
                    [styles.beatQuarter]:
                        beat % Math.floor(beatsPerBar / 4) === 0,
                })}
            >
                {padBeat(beat)}
            </Typography>
        </Box>
    );
}

const padBeat = (beat: number): string => beat.toString().padStart(2, "0");
