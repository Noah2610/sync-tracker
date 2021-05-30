import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Track from "../../lib/track";

export interface TrackStore {
    track?: Track;
}

const initialState: TrackStore = {
    track: undefined,
};

const trackSlice = createSlice({
    name: "track",
    initialState,
    reducers: {
        setTrack(state, { payload }: PayloadAction<Track>) {
            state.track = payload;
        },
    },
});

export const actions = trackSlice.actions;

export default trackSlice;
