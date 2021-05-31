import { useCallback } from "react";
import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";

export default function NewTrackButton() {
    const firebaseDispatch = useFirebaseDispatch();

    const newTrack = useCallback(
        () =>
            firebaseDispatch
                .newTrack({
                    doc: {
                        name: "New Track",
                        config: {
                            bpm: 80,
                            barLen: 4,
                            patternLen: 16,
                        },
                        patternArrangement: [],
                    },
                })
                .then((track) =>
                    firebaseDispatch.newPattern({
                        trackId: track.id,
                        doc: {
                            name: "New Pattern",
                            order: 0,
                            instrument: {
                                instrument: "Synth",
                            },
                        },
                    }),
                ),
        [firebaseDispatch],
    );

    return (
        <Button variant="contained" color="secondary" onClick={newTrack}>
            New Track
        </Button>
    );
}
