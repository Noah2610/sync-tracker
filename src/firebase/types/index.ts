import firebase from "firebase";
import Track from "../../../lib/track";
import Pattern from "../../../lib/track/pattern";
import Beat from "../../../lib/track/beat";
import Note from "../../../lib/track/note";

export type CollectionReference<T> = firebase.firestore.CollectionReference<T>;
export type DocumentReference<T> = firebase.firestore.DocumentReference<T>;
export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

export interface DocUser {}

export interface DocTrack {
    name: string;
    config: Track["config"];
    patternArrangement: Track["patternArrangement"];
}

export interface DocPattern {
    name: Pattern["name"];
    instrument: Pattern["instrument"];
    order: number;
}

export interface DocNote {
    order: number;
}

export interface DocBeat {
    beat: Beat;
    isActive: boolean;
}
