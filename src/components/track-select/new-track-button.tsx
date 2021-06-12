import { useCallback } from "react";
import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";
import { DocNote } from "../../firebase/types";
import { NoteId } from "../../store/types";

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
                    firebaseDispatch
                        .newPattern({
                            trackId: track.id,
                            doc: {
                                name: "New Pattern",
                                order: 0,
                                instrument: {
                                    instrument: "Synth",
                                },
                            },
                        })
                        .then((pattern) => ({
                            track,
                            pattern,
                        })),
                )
                .then(({ track, pattern }) =>
                    Promise.all(
                        (
                            [
                                {
                                    id: "C2",
                                    doc: {
                                        order: 0,
                                    },
                                },
                                {
                                    id: "D2",
                                    doc: {
                                        order: 1,
                                    },
                                },
                            ] as { id: NoteId; doc: DocNote }[]
                        ).map(({ id, doc }) =>
                            firebaseDispatch.setNote({
                                id,
                                doc,
                                trackId: track.id,
                                patternId: pattern.id,
                            }),
                        ),
                    ),
                ),
        [firebaseDispatch],
    );

    return (
        <Button variant="contained" color="secondary" onClick={newTrack}>
            New Track
        </Button>
    );
}
