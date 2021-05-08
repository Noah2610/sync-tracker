import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    useSelector as useReduxSelector,
    useDispatch as useReduxDispatch,
    TypedUseSelectorHook,
} from "react-redux";
import counter from "./counter";

const store = configureStore({
    reducer: combineReducers({
        counter: counter.reducer,
    }),
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export const useDispatch = () => useReduxDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = useReduxSelector;

export default store;
