import { configureStore } from "@reduxjs/toolkit";
import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
    useStore as useReduxStore,
    TypedUseSelectorHook,
} from "react-redux";
import track from "./track";

const store = configureStore({
    reducer: {
        track: track.reducer,
    },
});

export type Dispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;
export type Store = typeof store;

export const useDispatch = () => useReduxDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = useReduxSelector;
export const useStore = () => useReduxStore<State>();

export const actions = {
    track: track.actions,
};

export default store;
