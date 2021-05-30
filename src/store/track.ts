import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocNote, DocBeat, DocPattern, DocTrack } from "../firebase/types";
import {
    Track,
    TrackId,
    Patterns,
    PatternId,
    Note,
    Notes,
    NoteId,
    Beat,
    Beats,
    BeatId,
} from "./types";

export interface TrackStore {
    trackIds: string[];
    selectedTrackId?: TrackId;
    selectedPatternId?: PatternId;
    track?: Track;
    patterns: Patterns;
}

const initialState: TrackStore = {
    trackIds: [],
    selectedTrackId: undefined,
    selectedPatternId: undefined,
    track: undefined,
    patterns: {},
};

const trackSlice = createSlice({
    name: "track",
    initialState,
    reducers: {
        selectTrack(state, { payload }: PayloadAction<TrackId>) {
            state.selectedTrackId = payload;
        },

        selectPattern(state, { payload }: PayloadAction<PatternId>) {
            state.selectedPatternId = payload;
        },

        setTrackIds(state, { payload }: PayloadAction<TrackId[]>) {
            state.trackIds = payload;
        },

        setTrack(state, { payload }: PayloadAction<DocTrack>) {
            state.track = payload;
        },

        setPatterns(
            state,
            { payload }: PayloadAction<Record<PatternId, DocPattern>>,
        ) {
            for (const patternId in payload) {
                state.patterns[patternId] = {
                    ...payload[patternId]!,
                    notes: state.patterns[patternId]?.notes || {},
                };
            }
        },

        setPatternNotes(
            state,
            {
                payload: { patternId, notes },
            }: PayloadAction<{
                patternId: PatternId;
                notes: Record<NoteId, DocNote>;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                let noteId: NoteId;
                for (noteId in notes) {
                    pattern.notes[noteId] = {
                        ...notes[noteId]!,
                        beats: pattern.notes[noteId]?.beats || {},
                    };
                }
            } else {
                console.error(
                    `Can't set notes for pattern ${patternId} because pattern doesn't exist`,
                );
            }
        },

        updatePatternNotes(
            state,
            {
                payload: { patternId, notes },
            }: PayloadAction<{
                patternId: PatternId;
                notes: { [note in NoteId]?: DocNote | null };
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                let noteId: NoteId;
                for (noteId in notes) {
                    const note = notes[noteId];
                    if (note) {
                        pattern.notes[noteId] = {
                            ...note,
                            beats: pattern.notes[noteId]?.beats || {},
                        };
                    } else {
                        delete pattern.notes[noteId];
                    }
                }
            } else {
                console.error(
                    `Can't update notes for pattern ${patternId} because pattern doesn't exist`,
                );
            }
        },

        updatePatternBeats(
            state,
            {
                payload: { patternId, noteId, beats },
            }: PayloadAction<{
                patternId: PatternId;
                noteId: NoteId;
                beats: Record<BeatId, DocBeat | null>;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                const note = pattern.notes[noteId];
                if (note) {
                    for (const beatIdS in beats) {
                        const beatId = parseInt(beatIdS) || -1;
                        const beat = beats[beatId];
                        if (beat) {
                            note.beats[beatId] = beat;
                        } else {
                            if (note.beats[beatId]) {
                                delete note.beats[beatId];
                            }
                        }
                    }
                } else {
                    console.error(
                        `Can't update beats for note ${noteId} in pattern ${patternId} because note doesn't exist`,
                    );
                }
            } else {
                console.error(
                    `Can't update beats for pattern ${patternId} because pattern doesn't exist`,
                );
            }
        },
    },
});

export const actions = trackSlice.actions;

export default trackSlice;
