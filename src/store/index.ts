import {
    createSlice,
    configureStore,
    combineReducers,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    useSelector as useReduxSelector,
    useDispatch as useReduxDispatch,
    TypedUseSelectorHook,
} from "react-redux";

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

const store = configureStore({
    reducer: combineReducers({
        counter: counterSlice.reducer,
    }),
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const counterActions = counterSlice.actions;

export const useDispatch = () => useReduxDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = useReduxSelector;

export default store;
