import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import Track from "../../../lib/track";
import Pattern, { PatternId } from "../../../lib/track/pattern";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";
import TrackerGrid from "./tracker-grid";

export default function Tracker() {
    const ws = useWs();
    const [track, setTrack] = useState<Track | null>(null);
    const [
        selectedPatternId,
        setSelectedPatternId,
    ] = useState<PatternId | null>(null);

    useEffect(() => {
        if (ws) {
            ws.messages.on("UpdateTrack", ({ track }) => {
                setTrack(track);
                if (selectedPatternId === null) {
                    const pattern = track.patterns[0];
                    if (pattern) {
                        setSelectedPatternId(pattern.id);
                    }
                }
            });
        }
    }, []);

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

    console.log(track, selectedPatternId);

    return (
        <Box>
            {selectedPattern ? (
                <TrackerGrid
                    pattern={selectedPattern}
                    patternLen={track.config.patternLen}
                />
            ) : (
                <>No pattern selected.</>
            )}
        </Box>
    );
}
