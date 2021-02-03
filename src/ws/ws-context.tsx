import { createContext, useContext } from "react";
import WsState, { createWsState } from "./ws-state";

const WsContext = createContext<WsState | null>(null);

export function useWs(): WsState | null {
    return useContext(WsContext);
}

export interface WsProviderProps {
    children: React.ReactNode;
}

export function WsProvider({ children }: WsProviderProps) {
    const wsState = typeof window === "undefined" ? null : createWsState();

    if (wsState) {
        return (
            <WsContext.Provider value={wsState}>{children}</WsContext.Provider>
        );
    } else {
        return <>{children}</>;
    }
}

export default WsContext;
