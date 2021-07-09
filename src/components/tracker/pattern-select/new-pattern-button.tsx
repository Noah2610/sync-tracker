import { useCallback } from "react";
import { Button } from "@material-ui/core";
import { useSelector } from "../../../store";
import useFirebaseDispatch from "../../../firebase/use-firebase-dispatch";
import { DocNote } from "../../../firebase/types";
import { NoteId } from "../../../store/types";

export default function NewPatternButton() {
    const selectedTrackId = useSelector((state) => state.track.selectedTrackId);
    const firebaseDispatch = useFirebaseDispatch();

    const newPattern = useCallback(() => {
        if (selectedTrackId) {
            firebaseDispatch
                .newPattern({
                    trackId: selectedTrackId,
                    doc: {
                        name: "New Pattern",
                        order: 0,
                        instrument: {
                            name: "Synth",
                            isPoly: true,
                        },
                    },
                })
                .then((pattern) =>
                    Promise.all(
                        (
                            [
                                {
                                    id: "B2",
                                    doc: {
                                        order: 0,
                                    },
                                },
                                {
                                    id: "A2",
                                    doc: {
                                        order: 1,
                                    },
                                },
                                {
                                    id: "G2",
                                    doc: {
                                        order: 2,
                                    },
                                },
                                {
                                    id: "F2",
                                    doc: {
                                        order: 3,
                                    },
                                },
                                {
                                    id: "E2",
                                    doc: {
                                        order: 4,
                                    },
                                },
                                {
                                    id: "D2",
                                    doc: {
                                        order: 5,
                                    },
                                },
                                {
                                    id: "C2",
                                    doc: {
                                        order: 6,
                                    },
                                },
                            ] as { id: NoteId; doc: DocNote }[]
                        ).map(({ id, doc }) =>
                            firebaseDispatch.setNote({
                                id,
                                doc,
                                trackId: selectedTrackId,
                                patternId: pattern.id,
                            }),
                        ),
                    ),
                );
        }
    }, [firebaseDispatch, selectedTrackId]);

    if (!selectedTrackId) {
        return null;
    }

    return (
        <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={newPattern}
        >
            New Pattern
        </Button>
    );
}
