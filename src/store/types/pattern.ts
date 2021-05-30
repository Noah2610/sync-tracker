import LibPattern from "../../../lib/track/pattern";
import LibNote from "../../../lib/track/note";

export type Patterns = Record<PatternId, Pattern>;

export interface Pattern {
    name: LibPattern["name"];
    order: number;
    notes: Notes;
    instrument: LibPattern["instrument"];
}

export type Notes = {
    [noteId in NoteId]?: Note;
};

export interface Note {
    order: number;
    beats: Beats;
}

export type Beats = Record<BeatId, Beat>;

export interface Beat {
    isActive: boolean;
}

export type PatternId = string;
export type BeatId = number;
export type NoteId = LibNote;
