import { createStyles, makeStyles, Box } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { PatternId } from "../../../lib/track/pattern";
import useTrack from "../../hooks/use-track";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";
import PatternList from "./pattern-list";
import TrackerGrid from "./tracker-grid";

import { shallowEqual } from "react-redux";
import { useSelector } from "../../store";

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
    const ws = useWs();
    // const track = useTrack();
    const [
        selectedPatternId,
        setSelectedPatternId,
    ] = useState<PatternId | null>(null);

    const track = useSelector(
        (state) => state.track.track,
        shallowEqual, // TODO
    );

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

    if (!ws) {
        return <Loading />;
    }

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
                        ws={ws}
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
