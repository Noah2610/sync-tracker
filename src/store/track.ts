import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

        setTrack(state, { payload }: PayloadAction<Track>) {
            state.track = payload;
        },

        setPatterns(state, { payload }: PayloadAction<Patterns>) {
            state.patterns = payload;
        },

        setPatternNotes(
            state,
            {
                payload: { patternId, notes },
            }: PayloadAction<{
                patternId: PatternId;
                notes: Notes;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                pattern.notes = notes;
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
                notes: { [note in NoteId]?: Note | null };
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                let noteId: NoteId;
                for (noteId in notes) {
                    const note = notes[noteId] as Note | null;
                    if (note) {
                        pattern.notes[noteId] = note;
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
                beats: Record<BeatId, Beat | null>;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                const note = pattern.notes[noteId];
                if (note) {
                    for (const beatId of Object.keys(beats)) {
                        const beat = beats[beatId] as Beat | null;
                        if (beat) {
                            note.beats[beatId] = beat;
                        } else {
                            delete note.beats[beatId];
                        }
                    }
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

        // setTrack(state, { payload }: PayloadAction<Track>) {
        //     state.track = payload;
        // },
    },
});

export const actions = trackSlice.actions;

export default trackSlice;
