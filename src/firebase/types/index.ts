import firebase from "firebase";
import {
    Track,
    TrackId,
    Pattern,
    PatternId,
    Channel,
    ChannelId,
    Cell,
} from "../../store/types";

export type CollectionReference<T> = firebase.firestore.CollectionReference<T>;
export type DocumentReference<T> = firebase.firestore.DocumentReference<T>;
export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

export type WithoutId<T> = Omit<T, "id">;

export interface DocUser {}

export interface DocTrack {
    id: TrackId;
    name: string;
    config: Track["config"];
    patternArrangement: Track["patternArrangement"];
}

export interface DocPattern {
    id: PatternId;
    name: Pattern["name"];
    order: number;
}

export interface DocChannel {
    id: ChannelId;
    name: Channel["name"];
    instrument: Channel["instrument"];
}

export type DocCell = Cell;

// export interface DocNote {
//     order: number;
// }

// export interface DocBeat {
//     isActive: boolean;
// }
