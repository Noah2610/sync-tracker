import WebSocket from "ws";
import ClientConnection, { newClientConnection } from "./client-connection";

export default interface State {
    connections: ClientConnection[];
    newClientConnection(ws: WebSocket): void;
}

export function createState(): State {
    return {
        connections: [],
        newClientConnection(ws) {
            newClientConnection(this, ws);
        },
    };
}
