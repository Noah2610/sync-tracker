import WebSocket from "ws";
import ClientConnection, {
    addClientConnection,
    removeClientConnection,
} from "./client-connection";
import Track from "../../lib/track";

export default interface State {
    connections: ClientConnection[];
    track: Track;
    addClientConnection(ws: WebSocket): ClientConnection;
    removeClientConnection(clientId: number): void;
}

export function createState(track: Track): State {
    return {
        connections: [],
        track,
        addClientConnection(ws) {
            return addClientConnection(this, ws);
        },
        removeClientConnection(clientId: number) {
            removeClientConnection(this, clientId);
        },
    };
}
