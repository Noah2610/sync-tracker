import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from ".";
import {
    CollectionReference,
    DocumentReference,
    DocBeat,
    DocNote,
    DocPattern,
    DocTrack,
} from "./types";
import { TrackId, PatternId, NoteId, BeatId } from "../store/types";

export interface FirebaseDispatch {
    newTrack({ doc }: { doc: DocTrack }): Promise<DocumentReference<DocTrack>>;

    setTrack({ id, doc }: { id: TrackId; doc: DocTrack }): Promise<void>;

    deleteTrack({ id }: { id: TrackId }): Promise<void>;

    newPattern({
        trackId,
        doc,
    }: {
        trackId: TrackId;
        doc: DocPattern;
    }): Promise<DocumentReference<DocPattern>>;

    setPattern({
        id,
        trackId,
        doc,
    }: {
        id: PatternId;
        trackId: TrackId;
        doc: DocPattern;
    }): Promise<void>;

    deletePattern({
        id,
        trackId,
    }: {
        id: PatternId;
        trackId: TrackId;
    }): Promise<void>;

    setNote({
        id,
        trackId,
        patternId,
        doc,
    }: {
        id: NoteId;
        trackId: TrackId;
        patternId: PatternId;
        doc: DocNote;
    }): Promise<void>;

    setBeat({
        id,
        trackId,
        patternId,
        noteId,
        doc,
    }: {
        id: BeatId;
        trackId: TrackId;
        patternId: PatternId;
        noteId: NoteId;
        doc: DocBeat;
    }): Promise<void>;
}

export default function useFirebaseDispatch(): FirebaseDispatch {
    const userEmail = useAuthState(auth)[0]?.email;

    const dispatch: FirebaseDispatch = useMemo(() => {
        if (!userEmail) {
            const reject = () => Promise.reject("No user email");
            return {
                newTrack: reject,
                setTrack: reject,
                deleteTrack: reject,
                newPattern: reject,
                setPattern: reject,
                deletePattern: reject,
                setNote: reject,
                setBeat: reject,
            };
        }

        const baseRef = `/users/${userEmail}`;
        return {
            newTrack({ doc }) {
                return (
                    firestore.collection(
                        `${baseRef}/tracks`,
                    ) as CollectionReference<DocTrack>
                ).add(doc);
            },

            setTrack({ id, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${id}`,
                    ) as DocumentReference<DocTrack>
                ).set(doc);
            },

            deleteTrack({ id }) {
                return firestore.doc(`${baseRef}/tracks/${id}`).delete();
            },

            newPattern({ trackId, doc }) {
                return (
                    firestore.collection(
                        `${baseRef}/tracks/${trackId}/patterns`,
                    ) as CollectionReference<DocPattern>
                ).add(doc);
            },

            setPattern({ id, trackId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${id}`,
                    ) as DocumentReference<DocPattern>
                ).set(doc);
            },

            deletePattern({ id, trackId }) {
                return firestore
                    .doc(`${baseRef}/tracks/${trackId}/patterns/${id}`)
                    .delete();
            },

            setNote({ id, trackId, patternId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/notes/${id}`,
                    ) as DocumentReference<DocNote>
                ).set(doc);
            },

            setBeat({ id, trackId, patternId, noteId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/notes/${noteId}/beats/${id}`,
                    ) as DocumentReference<DocBeat>
                ).set(doc);
            },
        };
    }, [userEmail]);

    return dispatch;
}
