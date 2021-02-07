import { Box } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import { PatternId } from "../../../lib/track/pattern";
import useTrack from "../../hooks/use-track";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";
import PatternList from "./pattern-list";
import TrackerGrid from "./tracker-grid";

export default function Tracker() {
    const ws = useWs();
    const track = useTrack();
    const [
        selectedPatternId,
        setSelectedPatternId,
    ] = useState<PatternId | null>(null);

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

    console.log(selectedPattern?.id);

    return (
        <Box>
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

            <PatternList
                patterns={track.patterns}
                selectedPatternId={selectedPatternId ?? undefined}
                selectPattern={selectPattern}
            />
        </Box>
    );
}
