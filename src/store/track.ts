import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    Track,
    TrackId,
    Patterns,
    PatternId,
    Beats,
    Beat,
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

        setTrackIds(state, { payload }: PayloadAction<TrackId[]>) {
            state.trackIds = payload;
        },

        setTrack(state, { payload }: PayloadAction<Track>) {
            state.track = payload;
        },

        setPatterns(state, { payload }: PayloadAction<Patterns>) {
            state.patterns = payload;
        },

        setPatternBeats(
            state,
            {
                payload: { patternId, beats },
            }: PayloadAction<{
                patternId: PatternId;
                beats: Beats;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                pattern.beats = beats;
            } else {
                console.error(
                    `Can't set beats for pattern ${patternId} because pattern doesn't exist`,
                );
            }
        },

        updatePatternBeats(
            state,
            {
                payload: { patternId, beats },
            }: PayloadAction<{
                patternId: PatternId;
                beats: Record<BeatId, Beat | null>;
            }>,
        ) {
            const pattern = state.patterns[patternId];
            if (pattern) {
                for (const beatId of Object.keys(beats)) {
                    const beat = beats[beatId] as Beat | null;
                    if (beat) {
                        pattern.beats[beatId] = beat;
                    } else {
                        delete pattern.beats[beatId];
                    }
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
