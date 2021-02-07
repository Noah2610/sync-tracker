import { ClientMessage } from "../../lib/message";
import ClientConnection from "./client-connection";

/**
 * Send a `ClientMessage` to a given client.
 */
export default function sendMessage(
    client: ClientConnection,
    message: ClientMessage,
) {
    const messageRaw = JSON.stringify(message);
    client.ws.send(messageRaw);
}
