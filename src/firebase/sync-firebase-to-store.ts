import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from ".";
import {
    DocUser,
    DocTrack,
    DocPattern,
    DocNote,
    DocBeat,
    CollectionReference,
    DocumentReference,
    DocumentSnapshot,
} from "./types";
import { actions, useDispatch, useSelector } from "../store";
import {
    Beat,
    BeatId,
    Beats,
    Note,
    NoteId,
    Notes,
    PatternId,
    Patterns,
    Track,
} from "../store/types";

export default function SyncFirebaseToStore() {
    const userEmail = useAuthState(auth)[0]?.email;

    const dispatch = useDispatch();

    const selectedTrackId = useSelector((state) => state.track.selectedTrackId);
    const patternIds = useSelector(
        (state) => Object.keys(state.track.patterns),
        shallowEqual,
    );
    const patternNoteIds = useSelector(
        (state) =>
            Object.keys(state.track.patterns).reduce<
                Record<PatternId, NoteId[]>
            >(
                (acc, patternId) => ({
                    ...acc,
                    [patternId]: Object.keys(
                        state.track.patterns[patternId]!.notes,
                    ) as NoteId[],
                }),
                {},
            ),
        (a, b) =>
            [...Object.keys(a), ...Object.keys(b)].every((patternId) =>
                shallowEqual(a[patternId], b[patternId]),
            ),
    );

    // Update TRACK_IDS
    useEffect(() => {
        if (userEmail) {
            const unsubscribe = (
                firestore.collection(
                    `/users/${userEmail}/tracks`,
                ) as CollectionReference<DocTrack>
            ).onSnapshot((trackCollection) => {
                const trackIds = trackCollection.docs.map(
                    (docTrack) => docTrack.id,
                );

                dispatch(actions.track.setTrackIds(trackIds));
            }, console.error);

            return unsubscribe;
        }
    }, [userEmail]);

    // Update TRACK and PATTERNS from selectedTrackId
    useEffect(() => {
        if (userEmail && selectedTrackId !== undefined) {
            const trackRef = `/users/${userEmail}/tracks/${selectedTrackId}`;

            // Update TRACK
            const unsubscribeTrack = (
                firestore.doc(trackRef) as DocumentReference<DocTrack>
            ).onSnapshot((trackSnapshot) => {
                const trackDoc = trackSnapshot.data();
                if (trackDoc) {
                    const track: DocTrack = {
                        name: trackDoc.name,
                        config: trackDoc.config,
                        patternArrangement: trackDoc.patternArrangement,
                    };

                    dispatch(actions.track.setTrack(track));
                }
            }, console.error);

            // Update PATTERNS
            const unsubscribePatterns = (
                firestore.collection(
                    `${trackRef}/patterns`,
                ) as CollectionReference<DocPattern>
            ).onSnapshot((patternCollection) => {
                const patterns = patternCollection.docs.reduce<
                    Record<PatternId, DocPattern>
                >(
                    (patterns, patternDoc) => ({
                        ...patterns,
                        [patternDoc.id]: {
                            ...patternDoc.data(),
                        },
                    }),
                    {},
                );

                dispatch(actions.track.setPatterns(patterns));
            }, console.error);

            return () => {
                unsubscribeTrack();
                unsubscribePatterns();
            };
        }
    }, [userEmail, selectedTrackId]);

    // Update NOTES for every pattern
    useEffect(() => {
        if (
            userEmail &&
            selectedTrackId !== undefined &&
            patternIds.length > 0
        ) {
            const unsubscribes: (() => void)[] = [];

            for (const patternId of patternIds) {
                const unsubscribe = (
                    firestore.collection(
                        `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/notes`,
                    ) as CollectionReference<DocNote>
                ).onSnapshot((noteCollection) => {
                    const changedNotes = noteCollection
                        .docChanges()
                        .reduce<{ [noteId in NoteId]?: DocNote | null }>(
                            (notes, noteDoc) => ({
                                ...notes,
                                [noteDoc.doc.id]:
                                    noteDoc.newIndex === -1
                                        ? null
                                        : noteDoc.doc.data(),
                            }),
                            {},
                        );

                    dispatch(
                        actions.track.updatePatternNotes({
                            patternId,
                            notes: changedNotes,
                        }),
                    );
                }, console.error);

                unsubscribes.push(unsubscribe);
            }

            return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
        }
    }, [userEmail, selectedTrackId, patternIds]);

    // Update BEATS for every note in every pattern
    useEffect(() => {
        if (
            userEmail &&
            selectedTrackId !== undefined &&
            patternIds.length > 0
        ) {
            console.log("Update BEATS");

            const unsubscribes: (() => void)[] = [];

            for (const patternId of patternIds) {
                for (const noteId of patternNoteIds[patternId] || []) {
                    console.log(`${patternId}-${noteId}`);
                    const unsubscribe = (
                        firestore.collection(
                            `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/notes/${noteId}/beats`,
                        ) as CollectionReference<DocBeat>
                    ).onSnapshot((beatCollection) => {
                        const changedBeats = beatCollection
                            .docChanges()
                            .reduce<Record<BeatId, DocBeat | null>>(
                                (beats, beatDoc) => ({
                                    ...beats,
                                    [beatDoc.doc.id]:
                                        beatDoc.newIndex === -1
                                            ? null
                                            : beatDoc.doc.data(),
                                }),
                                {},
                            );

                        dispatch(
                            actions.track.updatePatternBeats({
                                patternId,
                                noteId,
                                beats: changedBeats,
                            }),
                        );
                    }, console.error);

                    unsubscribes.push(unsubscribe);
                }
            }

            return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
        }
    }, [userEmail, selectedTrackId, patternIds, patternNoteIds]);

    return null;
}
