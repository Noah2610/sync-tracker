import WebSocket from "ws";
import { parseServerMessage } from "../../lib/message";
import ClientConnection from "./client-connection";
import sendMessage from "./send-message";
import State from "./state";

/**
 * Handle incoming `ServerMessage` from a client.
 */
export default function handleMessage(
    state: State,
    client: ClientConnection,
    data: WebSocket.Data,
) {
    const message = parseServerMessage(data);
    if (message) {
        switch (message.kind) {
            case "Message": {
                state.connections.forEach((conn) =>
                    sendMessage(conn, {
                        kind: "Message",
                        client: client.client,
                        content: message.content,
                    }),
                );
                break;
            }

            case "UpdateClientName": {
                client.client.name = message.name;
                state.connections.forEach((conn) =>
                    sendMessage(conn, {
                        kind: "UpdateClient",
                        client: client.client,
                    }),
                );
                break;
            }

            default: {
                console.error("Unknown ServerMessage", message);
            }
        }
    }
}
