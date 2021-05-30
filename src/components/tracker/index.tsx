import { createStyles, makeStyles, Box } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import Track from "../../../lib/track";
import { PatternId } from "../../../lib/track/pattern";
import Loading from "../loading";
import PatternList from "./pattern-list";
import TrackerGrid from "./tracker-grid";

const useStyles = makeStyles((theme) =>
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
    const [selectedPatternId, setSelectedPatternId] =
        useState<PatternId | null>(null);

    const track = null as Track | null;

    useEffect(() => {
        if (track && selectedPatternId === null) {
            const pattern = track.patterns[0];
            if (pattern) {
                setSelectedPatternId(pattern.id);
            }
        }
    }, [track]);

    const selectPattern = useCallback(
        (patternId: PatternId) => setSelectedPatternId(patternId),
        [],
    );

    if (!track) {
        return (
            <>
                <Loading />
                Waiting for track data...
            </>
        );
    }

    const selectedPattern =
        selectedPatternId !== null
            ? track.patterns.find((pat) => pat.id === selectedPatternId)
            : undefined;

    return (
        <Box className={styles.root}>
            <Box className={styles.grid}>
                {selectedPattern ? (
                    <TrackerGrid
                        pattern={selectedPattern}
                        patternLen={track.config.patternLen}
                        barLen={track.config.barLen}
                    />
                ) : (
                    <>No pattern selected.</>
                )}
            </Box>

            <Box className={styles.patternList}>
                <PatternList
                    patterns={track.patterns}
                    selectedPatternId={selectedPatternId ?? undefined}
                    selectPattern={selectPattern}
                />
            </Box>
        </Box>
    );
}
