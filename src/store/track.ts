import { Dispatch, SetStateAction } from "react";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Store } from ".";
import { SharedMessageOfKind } from "../../lib/message/shared-message";
import Track from "../../lib/track";
import { PatternId } from "../../lib/track/pattern";
import { updateTrackBeat } from "../../lib/track/update";
import WsState, { createWsState } from "../ws/ws-state";

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

        updateTrackBeat(
            state,
            {
                payload,
            }: PayloadAction<
                Omit<SharedMessageOfKind<"UpdateTrackBeat">, "kind">
            >,
        ) {
            if (state.track) {
                const message: SharedMessageOfKind<"UpdateTrackBeat"> = {
                    kind: "UpdateTrackBeat",
                    ...payload,
                };
                const updatedTrack = updateTrackBeat(
                    state.track as Track,
                    message,
                );
                if (updatedTrack.didUpdate) {
                    state.track = updatedTrack.track;
                }
            }
        },
    },
});

export const actions = trackSlice.actions;

// export function setupWs(store: Store) {
//     const update: Dispatch<SetStateAction<WsState>> = (setter) => {
//         const newWsState =
//             typeof setter === "function"
//                 ? setter(store.getState().track.wsState!)
//                 : setter;
//         store.dispatch(actions.setWsState(newWsState));
//     };
//     const wsState = createWsState(update);
//     store.dispatch(actions.setWsState(wsState));
// }

export default trackSlice;
