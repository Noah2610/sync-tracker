import LibPattern from "../../../lib/track/pattern";
import LibNote from "../../../lib/track/note";
import { Channels } from "./channel";

export type PatternId = string;

export type Patterns = Record<PatternId, Pattern>;

export interface Pattern {
    id: PatternId;
    name: LibPattern["name"];
    channels: Channels;
    order: number;
    // notes: Notes;
    // instrument: Instrument;
}

// export type Notes = {
//     [noteId in NoteId]?: Note;
// };

// export interface Note {
//     order: number;
//     beats: Beats;
// }

// export type Beats = Record<BeatId, Beat>;

// export interface Beat {
//     isActive: boolean;
// }

// export type Instrument = LibPattern["instrument"];

// export type BeatId = number;
// export type NoteId = LibNote;
