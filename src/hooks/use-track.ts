import { useEffect, useState } from "react";
import Track from "../../lib/track";
import { updateTrackBeat } from "../../lib/track/update";
import useWs from "./use-ws";

/**
 * Returns the track when it is received from a WS ClientMessage.
 */
export default function useTrack(): Track | null {
    const ws = useWs();
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        if (ws) {
            ws.messages.on("UpdateTrack", ({ track: newTrack }) => {
                setTrack(newTrack);
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

    return track;
}
