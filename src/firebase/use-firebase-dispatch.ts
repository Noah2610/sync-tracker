import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from ".";
import {
    DocumentReference,
    DocTrack,
    DocPattern,
    DocNote,
    DocBeat,
} from "./types";
import { TrackId, PatternId, NoteId, BeatId } from "../store/types";

export interface FirebaseDispatch {
    setTrack({ id, doc }: { id: TrackId; doc: DocTrack }): Promise<void>;

    setPattern({
        id,
        trackId,
        doc,
    }: {
        id: PatternId;
        trackId: TrackId;
        doc: DocPattern;
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
                setTrack: reject,
                setPattern: reject,
                setNote: reject,
                setBeat: reject,
            };
        }

        const baseRef = `/users/${userEmail}`;
        return {
            setTrack({ id, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${id}`,
                    ) as DocumentReference<DocTrack>
                ).set(doc);
            },

            setPattern({ id, trackId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${id}`,
                    ) as DocumentReference<DocPattern>
                ).set(doc);
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
