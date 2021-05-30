import { useEffect } from "react";
import { shallowEqual } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from ".";
import {
    DocUser,
    DocTrack,
    DocPattern,
    DocBeat,
    CollectionReference,
    DocumentReference,
    DocumentSnapshot,
} from "./types";
import { actions, useDispatch, useSelector } from "../store";
import { Track, Patterns, Beats, Beat, BeatId } from "../store/types";

export default function SyncFirebaseToStore() {
    const userEmail = useAuthState(auth)[0]?.email;

    const dispatch = useDispatch();

    const selectedTrackId = useSelector((state) => state.track.selectedTrackId);
    const patternIds = useSelector(
        (state) => Object.keys(state.track.patterns),
        shallowEqual,
    );

    // const user = useDocument(`/users/${userEmail}`);

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
                    const track: Track = {
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
                const patterns = patternCollection.docs.reduce<Patterns>(
                    (patterns, patternDoc) => ({
                        ...patterns,
                        [patternDoc.id]: {
                            ...patternDoc.data(),
                            beats: {},
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

    // Update BEATS for every pattern
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
                        `/users/${userEmail}/tracks/${selectedTrackId}/patterns/${patternId}/beats`,
                    ) as CollectionReference<DocBeat>
                ).onSnapshot((beatCollection) => {
                    const changedBeats = beatCollection
                        .docChanges()
                        .reduce<Record<BeatId, Beat | null>>(
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
                            beats: changedBeats,
                        }),
                    );
                }, console.error);

                unsubscribes.push(unsubscribe);
            }

            return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
        }
    }, [userEmail, selectedTrackId, patternIds]);

    return null;
}
