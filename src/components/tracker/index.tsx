import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import Track from "../../../lib/track";
import Pattern, { PatternId } from "../../../lib/track/pattern";
import { updateTrackBeat } from "../../../lib/track/update";
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
            ws.messages.on("UpdateTrack", ({ track: newTrack }) => {
                setTrack(newTrack);
                if (selectedPatternId === null) {
                    const pattern = newTrack.patterns[0];
                    if (pattern) {
                        setSelectedPatternId(pattern.id);
                    }
                }
            });
            ws.messages.on("UpdateTrackBeat", (message) => {
                setTrack((prev) => {
                    if (prev) {
                        const { track: newTrack, didUpdate } = updateTrackBeat(
                            prev,
                            message,
                        );
                        if (didUpdate) {
                            return newTrack;
                        } else {
                            return prev;
                        }
                    } else {
                        console.error(
                            "Can't update track, no track data received yet.",
                        );
                        return prev;
                    }
                });
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
        </Box>
    );
}
