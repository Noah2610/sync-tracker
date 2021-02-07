import WebSocket from "ws";
import { parseServerMessage, ServerMessageOfKind } from "../../lib/message";
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

            case "UpdateTrackPart": {
                handleMessageUpdateTrackPart(state, client, message);
                break;
            }

            default: {
                console.error("Unknown ServerMessage", message);
            }
        }
    }
}

function handleMessageUpdateTrackPart(
    state: State,
    client: ClientConnection,
    message: ServerMessageOfKind<"UpdateTrackPart">,
) {
    switch (message.part) {
        case "Beat": {
            const { patternId, note, step, active } = message;
            const pattern = state.track.patterns.find(
                (pat) => pat.id === patternId,
            );
            if (pattern) {
                const patternNote = pattern.notes.find((n) => n.note === note);
                if (patternNote) {
                    let didChange = false;
                    const alreadyActive = patternNote.beats.includes(step);
                    if (active && !alreadyActive) {
                        patternNote.beats.push(step);
                        didChange = true;
                    } else if (!active && alreadyActive) {
                        const idx = patternNote.beats.indexOf(step);
                        if (idx !== -1) {
                            patternNote.beats.splice(idx, 1);
                        }
                        didChange = true;
                    }
                    if (didChange) {
                        state.connections.forEach((conn) =>
                            sendMessage(conn, message),
                        );
                    }
                } else {
                    console.error(
                        `Note ${note} in pattern ${patternId} not found.`,
                    );
                }
            } else {
                console.error(`Pattern with PatternId ${patternId} not found.`);
            }
            break;
        }
        default: {
            console.error("Unknown ServerMessage UpdateTrackPart", message);
        }
    }
}
