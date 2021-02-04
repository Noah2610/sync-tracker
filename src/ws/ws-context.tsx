import { createContext, useContext, useEffect, useState } from "react";
import WsState, { createWsState } from "./ws-state";

const WsContext = createContext<WsState | null>(null);

export function useWs(): WsState | null {
    return useContext(WsContext);
}

export interface WsProviderProps {
    children: React.ReactNode;
}

export function WsProvider({ children }: WsProviderProps) {
    const [wsState, setWsState] = useState<WsState | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && !wsState) {
            setWsState(
                createWsState(
                    setWsState as React.Dispatch<React.SetStateAction<WsState>>,
                ),
            );
        }
    }, []);

    if (wsState) {
        return (
            <WsContext.Provider value={wsState}>{children}</WsContext.Provider>
        );
    } else {
        return <>{children}</>;
    }
}

export default WsContext;
