import { Box, Typography, createStyles, makeStyles } from "@material-ui/core";

type BeatVariant = "bar" | "quarter" | "sixteenth";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {},
        beat: ({ variant }: { variant: BeatVariant }) => ({
            fontWeight: variant === "bar" ? "bold" : "normal",
        }),
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
    const variant: BeatVariant = (() => {
        if (beat % beatsPerBar === 0) {
            return "bar";
        }
        if (beat % Math.floor(beatsPerBar / 4) === 0) {
            return "quarter";
        }
        return "sixteenth";
    })();
    const styles = useStyles({ variant });

    return (
        <Box className={styles.root}>
            <Typography className={styles.beat}>{padBeat(beat)}</Typography>
        </Box>
    );
}

const padBeat = (beat: number): string => beat.toString().padStart(2, "0");
