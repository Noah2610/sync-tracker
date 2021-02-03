import { ServerMessage } from "../lib/message";

/**
 * Send the given message to the WS server.
 */
export default function sendMessage(ws: WebSocket, message: ServerMessage) {
    ws.send(JSON.stringify(message));
}
