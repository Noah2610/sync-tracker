import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from ".";
import {
    DocUser,
    DocTrack,
    DocPattern,
    CollectionReference,
    DocumentReference,
    DocumentSnapshot,
    DocChannel,
    DocCell,
} from "./types";
import { actions, useDispatch, useSelector } from "../store";
import { ChannelId, PatternId, Patterns, Track, Tracks } from "../store/types";
import safeObjectKeys from "../util/safeObjectKeys";
import { createUnsubs } from "../util/unsubs";

export default function SyncFirebaseToStore() {
    const userEmail = useAuthState(auth)[0]?.email;

    const dispatch = useDispatch();

    const selectedTrackId = useSelector(
        (state) => state.track.selectedTrack?.id,
    );
    const selectedPatternId = useSelector(
        (state) => state.track.selectedTrack?.selectedPattern?.id,
    );
    const patternAndChannelIds = useSelector((state) => {
        if (!state.track.selectedTrack) {
            return undefined;
        }
        const track = state.track.tracks[state.track.selectedTrack.id];
        if (!track) {
            return undefined;
        }
        return Object.values(track.patterns).reduce<
            Record<PatternId, ChannelId[]>
        >(
            (acc, pattern) => ({
                ...acc,
                [pattern.id]: safeObjectKeys(pattern.channels),
            }),
            {},
        );
    }, shallowEqual);

    // const patternNoteIds = useSelector(
    //     (state) =>
    //         Object.keys(state.track.patterns).reduce<
    //             Record<PatternId, NoteId[]>
    //         >(
    //             (acc, patternId) => ({
    //                 ...acc,
    //                 [patternId]: Object.keys(
    //                     state.track.patterns[patternId]!.notes,
    //                 ) as NoteId[],
    //             }),
    //             {},
    //         ),
    //     (a, b) =>
    //         [...Object.keys(a), ...Object.keys(b)].every((patternId) =>
    //             shallowEqual(a[patternId], b[patternId]),
    //         ),
    // );

    // Update TRACKS
    useEffect(() => {
        if (!userEmail) {
            return;
        }

        const unsubscribe = (
            firestore.collection(
                `/users/${userEmail}/tracks`,
            ) as CollectionReference<DocTrack>
        ).onSnapshot((trackCollection) => {
            const tracks = trackCollection.docs.reduce<DocTrack[]>(
                (tracks, doc) => [
                    ...tracks,
                    {
                        ...{ id: doc.id },
                        ...doc.data(),
                    },
                ],
                [],
            );

            dispatch(actions.track.setStateTracks(tracks));
        }, console.error);

        return unsubscribe;
    }, [userEmail]);

    // Update TRACK and PATTERNS from selectedTrackId
    useEffect(() => {
        if (!userEmail || selectedTrackId === undefined) {
            return;
        }

        const trackRef = `/users/${userEmail}/tracks/${selectedTrackId}`;

        const unsubs: (() => void)[] = [];

        // Update TRACK
        unsubs.push(
            (firestore.doc(trackRef) as DocumentReference<DocTrack>).onSnapshot(
                (trackSnapshot) => {
                    const trackDoc = trackSnapshot.data();
                    if (trackDoc) {
                        dispatch(
                            actions.track.setStateTracks([
                                {
                                    ...{ id: trackSnapshot.id },
                                    ...trackDoc,
                                },
                            ]),
                        );
                    }
                },
                console.error,
            ),
        );

        // Update PATTERNS
        const patternsRef = `${trackRef}/patterns`;
        unsubs.push(
            (
                firestore.collection(
                    patternsRef,
                ) as CollectionReference<DocPattern>
            ).onSnapshot((patternCollection) => {
                const patterns = patternCollection.docs.map((patternDoc) => ({
                    ...{ id: patternDoc.id },
                    ...patternDoc.data(),
                }));

                dispatch(
                    actions.track.setStatePatterns({
                        trackId: selectedTrackId,
                        patterns,
                    }),
                );
            }, console.error),
        );

        return () => unsubs.forEach((cb) => cb());
    }, [userEmail, selectedTrackId]);

    // Update CHANNELS from selectedTrackId and pattern IDs
    useEffect(() => {
        if (
            !userEmail ||
            selectedTrackId === undefined ||
            !patternAndChannelIds
        ) {
            return;
        }

        const channelsRef = `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${selectedPatternId}/channels`;

        const unsubs = createUnsubs();

        for (const patternId of safeObjectKeys(patternAndChannelIds)) {
            unsubs.add(
                (
                    firestore.collection(
                        channelsRef,
                    ) as CollectionReference<DocChannel>
                ).onSnapshot((channelCollection) => {
                    const channels = channelCollection.docs.map(
                        (channelDoc) => ({
                            ...{ id: channelDoc.id },
                            ...channelDoc.data(),
                        }),
                    );
                    dispatch(
                        actions.track.setStateChannels({
                            trackId: selectedTrackId,
                            patternId: patternId,
                            channels,
                        }),
                    );
                }),
            );
        }

        return unsubs.unsubAll;
    }, [userEmail, selectedTrackId, patternAndChannelIds]);

    // Update CELLS from selectedTrackId and channel IDs
    useEffect(() => {
        if (
            !userEmail ||
            selectedTrackId === undefined ||
            !patternAndChannelIds
        ) {
            return;
        }

        const unsubs = createUnsubs();

        for (const patternId of safeObjectKeys(patternAndChannelIds)) {
            const channelIds = patternAndChannelIds[patternId]!;
            for (const channelId of channelIds) {
                const cellsRef = `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/channels/${channelId}/cells`;
                (
                    firestore.collection(
                        cellsRef,
                    ) as CollectionReference<DocCell>
                ).onSnapshot((cellsSnapshot) => {
                    const cells = cellsSnapshot.docs.map((cell) => ({
                        ...{ id: cell.id },
                        ...cell.data(),
                    }));
                    dispatch(
                        actions.track.setStateCells({
                            trackId: selectedTrackId,
                            patternId,
                            channelId,
                            cells,
                        }),
                    );
                }, console.error);
            }
        }

        return unsubs.unsubAll;
    }, [userEmail, selectedTrackId, patternAndChannelIds]);

    // Update NOTES for every pattern
    // useEffect(() => {
    //     if (
    //         userEmail &&
    //         selectedTrackId !== undefined &&
    //         patternIds.length > 0
    //     ) {
    //         const unsubscribes: (() => void)[] = [];

    //         for (const patternId of patternIds) {
    //             const unsubscribe = (
    //                 firestore.collection(
    //                     `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/notes`,
    //                 ) as CollectionReference<DocNote>
    //             ).onSnapshot((noteCollection) => {
    //                 const changedNotes = noteCollection
    //                     .docChanges()
    //                     .reduce<{ [noteId in NoteId]?: DocNote | null }>(
    //                         (notes, noteDoc) => ({
    //                             ...notes,
    //                             [noteDoc.doc.id]:
    //                                 noteDoc.newIndex === -1
    //                                     ? null
    //                                     : noteDoc.doc.data(),
    //                         }),
    //                         {},
    //                     );

    //                 dispatch(
    //                     actions.track.updatePatternNotes({
    //                         patternId,
    //                         notes: changedNotes,
    //                     }),
    //                 );
    //             }, console.error);

    //             unsubscribes.push(unsubscribe);
    //         }

    //         return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    //     }
    // }, [userEmail, selectedTrackId, patternIds]);

    // // Update BEATS for every note in every pattern
    // useEffect(() => {
    //     if (
    //         userEmail &&
    //         selectedTrackId !== undefined &&
    //         patternIds.length > 0
    //     ) {
    //         const unsubscribes: (() => void)[] = [];

    //         for (const patternId of patternIds) {
    //             for (const noteId of patternNoteIds[patternId] || []) {
    //                 const unsubscribe = (
    //                     firestore.collection(
    //                         `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/notes/${noteId}/beats`,
    //                     ) as CollectionReference<DocBeat>
    //                 ).onSnapshot((beatCollection) => {
    //                     const changedBeats = beatCollection
    //                         .docChanges()
    //                         .reduce<Record<BeatId, DocBeat | null>>(
    //                             (beats, beatDoc) => ({
    //                                 ...beats,
    //                                 [beatDoc.doc.id]:
    //                                     beatDoc.newIndex === -1
    //                                         ? null
    //                                         : beatDoc.doc.data(),
    //                             }),
    //                             {},
    //                         );

    //                     dispatch(
    //                         actions.track.updatePatternBeats({
    //                             patternId,
    //                             noteId,
    //                             beats: changedBeats,
    //                         }),
    //                     );
    //                 }, console.error);

    //                 unsubscribes.push(unsubscribe);
    //             }
    //         }

    //         return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
    //     }
    // }, [userEmail, selectedTrackId, patternIds, patternNoteIds]);

    return null;
}
