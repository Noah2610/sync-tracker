import { useState, Dispatch, SetStateAction } from "react";

export type BooleanState = [
    boolean,
    {
        set: Dispatch<SetStateAction<boolean>>;
        toggle: () => void;
        on: () => void;
        off: () => void;
    },
];

export default function useBooleanState(
    defaultValue: boolean = false,
): BooleanState {
    const [state, set] = useState(defaultValue);
    const toggle = () => set((prev) => !prev);
    const on = () => set(true);
    const off = () => set(false);
    return [state, { set, toggle, on, off }];
}
