import firebase from "firebase";
import Track from "../../../lib/track";
import Pattern from "../../../lib/track/pattern";

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
    order: number;
    instrument: Pattern["instrument"];
}

export interface DocNote {
    order: number;
}

export interface DocBeat {
    isActive: boolean;
}
