import type { ServerMessage } from "../lib/message";

/**
 * Send the given message to the WS server.
 */
export default function sendMessage(ws: WebSocket, message: ServerMessage) {
    console.log(message);
    ws.send(JSON.stringify(message));
}
