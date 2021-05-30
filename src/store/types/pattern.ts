import LibPattern from "../../../lib/track/pattern";
import LibBeat from "../../../lib/track/beat";
import LibNote from "../../../lib/track/note";

export type Patterns = Record<PatternId, Pattern>;

export interface Pattern {
    name: LibPattern["name"];
    order: number;
    beats: Beats;
    instrument: LibPattern["instrument"];
}

export type Beats = Record<BeatId, Beat>;

export interface Beat {
    beat: LibBeat;
    note: LibNote;
    isActive: boolean;
}

export type PatternId = string;
export type BeatId = string;
