import WebSocket from "ws";
import ClientConnection, {
    addClientConnection,
    removeClientConnection,
} from "./client-connection";

export default interface State {
    connections: ClientConnection[];
    addClientConnection(ws: WebSocket): ClientConnection;
    removeClientConnection(clientId: number): void;
}

export function createState(): State {
    return {
        connections: [],
        addClientConnection(ws) {
            return addClientConnection(this, ws);
        },
        removeClientConnection(clientId: number) {
            removeClientConnection(this, clientId);
        },
    };
}
