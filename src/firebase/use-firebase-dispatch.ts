import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from ".";
import {
    CollectionReference,
    DocumentReference,
    DocPattern,
    DocTrack,
    DocChannel,
    DocCell,
} from "./types";
import { TrackId, PatternId, ChannelId, CellId } from "../store/types";

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

    newChannel({
        trackId,
        patternId,
        doc,
    }: {
        trackId: TrackId;
        patternId: PatternId;
        doc: DocChannel;
    }): Promise<DocumentReference<DocChannel>>;

    setChannel({
        id,
        trackId,
        patternId,
        doc,
    }: {
        id: ChannelId;
        trackId: TrackId;
        patternId: PatternId;
        doc: DocChannel;
    }): Promise<void>;

    deleteChannel({
        id,
        trackId,
        patternId,
    }: {
        id: ChannelId;
        trackId: TrackId;
        patternId: PatternId;
    }): Promise<void>;

    newCell({
        trackId,
        patternId,
        channelId,
        doc,
    }: {
        trackId: TrackId;
        patternId: PatternId;
        channelId: ChannelId;
        doc: DocCell;
    }): Promise<DocumentReference<DocCell>>;

    setCell({
        id,
        trackId,
        patternId,
        channelId,
        doc,
    }: {
        id: CellId;
        trackId: TrackId;
        patternId: PatternId;
        channelId: ChannelId;
        doc: DocCell;
    }): Promise<void>;

    deleteCell({
        id,
        trackId,
        patternId,
        channelId,
    }: {
        id: CellId;
        trackId: TrackId;
        patternId: PatternId;
        channelId: ChannelId;
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
                newChannel: reject,
                setChannel: reject,
                deleteChannel: reject,
                newCell: reject,
                setCell: reject,
                deleteCell: reject,
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

            newChannel({ trackId, patternId, doc }) {
                return (
                    firestore.collection(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels`,
                    ) as CollectionReference<DocChannel>
                ).add(doc);
            },

            setChannel({ id, trackId, patternId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels/${id}`,
                    ) as DocumentReference<DocChannel>
                ).set(doc);
            },

            deleteChannel({ id, trackId, patternId }) {
                return firestore
                    .doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels/${id}`,
                    )
                    .delete();
            },

            newCell({ trackId, patternId, channelId, doc }) {
                return (
                    firestore.collection(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels/${channelId}/cells`,
                    ) as CollectionReference<DocCell>
                ).add(doc);
            },

            setCell({ id, trackId, patternId, channelId, doc }) {
                return (
                    firestore.doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels/${channelId}/cells/${id}`,
                    ) as DocumentReference<DocCell>
                ).set(doc);
            },

            deleteCell({ id, trackId, patternId, channelId }) {
                return firestore
                    .doc(
                        `${baseRef}/tracks/${trackId}/patterns/${patternId}/channels/${channelId}/cells/${id}`,
                    )
                    .delete();
            },
        };
    }, [userEmail]);

    return dispatch;
}
