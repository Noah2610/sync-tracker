import { useCallback } from "react";
import { Button } from "@material-ui/core";
import { useSelector } from "../../../store";
import useFirebaseDispatch from "../../../firebase/use-firebase-dispatch";
import { DocCell, DocChannel, WithoutId } from "../../../firebase/types";

export default function NewPatternButton() {
    const selectedTrackId = useSelector(
        (state) => state.track.selectedTrack?.id,
    );
    const firebaseDispatch = useFirebaseDispatch();

    const newPattern = useCallback(() => {
        if (selectedTrackId !== undefined) {
            firebaseDispatch
                .newPattern({
                    trackId: selectedTrackId,
                    doc: {
                        name: "New Pattern",
                        order: 0,
                    },
                })
                .then((pattern) =>
                    Promise.all(
                        Array.from({ length: 5 })
                            .map(
                                (_, i) =>
                                    ({
                                        name: `Channel ${i}`,
                                        instrument: {
                                            name: "Synth",
                                            isPoly: true,
                                        },
                                    } as WithoutId<DocChannel>),
                            )
                            .map((doc) =>
                                firebaseDispatch
                                    .newChannel({
                                        doc,
                                        trackId: selectedTrackId,
                                        patternId: pattern.id,
                                    })
                                    .then((channel) =>
                                        Promise.all(
                                            [
                                                "B2",
                                                "A2",
                                                "G2",
                                                "F2",
                                                "E2",
                                                "D2",
                                                "C2",
                                            ]
                                                .map(
                                                    (note, i) =>
                                                        ({
                                                            type: "note",
                                                            id: `0:${i}:0`,
                                                            note,
                                                        } as DocCell),
                                                )
                                                .map((doc) =>
                                                    firebaseDispatch.setCell({
                                                        doc,
                                                        id: doc.id,
                                                        trackId:
                                                            selectedTrackId,
                                                        patternId: pattern.id,
                                                        channelId: channel.id,
                                                    }),
                                                ),
                                        ),
                                    ),
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
