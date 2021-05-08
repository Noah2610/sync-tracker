import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counter",
    initialState: {
        value: 0,
    },
    reducers: {
        set(state, { payload }: PayloadAction<number>) {
            state.value = payload;
        },
        add(state, { payload }: PayloadAction<number>) {
            state.value += payload;
        },
        sub(state, { payload }: PayloadAction<number>) {
            state.value -= payload;
        },
    },
});

export const actions = counterSlice.actions;

export default counterSlice;
