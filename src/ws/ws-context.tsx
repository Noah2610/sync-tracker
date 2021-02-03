import { createContext } from "react";
import WsState from "./ws-state";

const WsContext = createContext<WsState>(null);

export default WsContext;
