import { useEffect, useState } from "react";
import { ClientMessageOfKind } from "../../lib/message";
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
            const updateTrackListener = ({
                track: newTrack,
            }: {
                track: Track;
            }) => setTrack(newTrack);
            ws.messages.on("UpdateTrack", updateTrackListener);

            const updateTrackBeatListener = (
                message: ClientMessageOfKind<"UpdateTrackBeat">,
            ) =>
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
            ws.messages.on("UpdateTrackBeat", updateTrackBeatListener);

            return () => {
                ws.messages.remove("UpdateTrack", updateTrackListener);
                ws.messages.remove("UpdateTrackBeat", updateTrackBeatListener);
            };
        }
    }, []);

    return track;
}
