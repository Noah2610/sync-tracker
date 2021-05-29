import { Dispatch, SetStateAction } from "react";
import Client from "../../lib/client";
import { ServerMessage, ClientMessageOfKind } from "../../lib/message";
import WsMessageEmitter from "./ws-message-emitter";

const WS_URL =
    process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || "ws://0.0.0.0:8090";

export default interface WsState {
    ws: WebSocket;
    client?: Client;
    connectedClients: Client[];
    sendMessage: (message: ServerMessage) => void;
    messages: WsMessageEmitter;

    cleanup?: () => void;
}

function createWs(): WebSocket | null {
    let ws: WebSocket | null = null;

    try {
        ws = new WebSocket(WS_URL);
    } catch (e) {
        console.error(e);
        return null;
    }

    return ws;
}

export type SetWsState = (
    setter: ((wsState: WsState) => WsState) | WsState,
) => void;

export function createWsState(setWsState: SetWsState): WsState {
    const ws = createWs();

    if (!ws) {
        throw new Error("Couldn't create WebSocket.");
    }

    const messages = new WsMessageEmitter(ws);

    const cleanup = setupCoreListeners(messages, setWsState) || undefined;

    const state: WsState = {
        ws,
        sendMessage(message: ServerMessage) {
            ws.send(JSON.stringify(message));
        },
        client: undefined,
        connectedClients: [],
        messages,
        cleanup,
    };

    return state;
}

function setupCoreListeners(
    messages: WsMessageEmitter,
    setWsState: SetWsState,
): () => void {
    const connectedListener = (message: ClientMessageOfKind<"Connected">) =>
        setWsState((prev) => ({
            ...prev,
            client: message.client,
        }));
    messages.on("Connected", connectedListener);

    const updateClientListener = (
        message: ClientMessageOfKind<"UpdateClient">,
    ) =>
        setWsState((prev) => {
            const connectedClients: Client[] = [];
            let isNewClient = true;

            for (const conn of prev.connectedClients) {
                if (conn.id === message.client.id) {
                    if (!message.disconnected) {
                        connectedClients.push(message.client);
                    }
                    isNewClient = false;
                } else {
                    connectedClients.push(conn);
                }
            }

            if (isNewClient && !message.disconnected) {
                connectedClients.push(message.client);
            }

            let client = prev.client;
            if (client && client.id === message.client.id) {
                client = message.client;
            }

            return {
                ...prev,
                client,
                connectedClients,
            };
        });
    messages.on("UpdateClient", updateClientListener);

    return () => {
        messages.remove("Connected", connectedListener);
        messages.remove("UpdateClient", updateClientListener);
    };
}
