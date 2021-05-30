import { firestore } from ".";
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
    return {
        setTrack({ id, doc }: { id: TrackId; doc: DocTrack }) {
            return (
                firestore.doc(`/tracks/${id}`) as DocumentReference<DocTrack>
            ).set(doc);
        },

        setPattern({
            id,
            trackId,
            doc,
        }: {
            id: PatternId;
            trackId: TrackId;
            doc: DocPattern;
        }) {
            return (
                firestore.doc(
                    `/tracks/${trackId}/patterns/${id}`,
                ) as DocumentReference<DocPattern>
            ).set(doc);
        },

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
        }) {
            return (
                firestore.doc(
                    `/tracks/${trackId}/patterns/${patternId}/notes/${id}`,
                ) as DocumentReference<DocNote>
            ).set(doc);
        },

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
        }) {
            return (
                firestore.doc(
                    `/tracks/${trackId}/patterns/${patternId}/notes/${noteId}/beats/${id}`,
                ) as DocumentReference<DocBeat>
            ).set(doc);
        },
    };
}
