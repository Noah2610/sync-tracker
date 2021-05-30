import { Dispatch, SetStateAction } from "react";
import produce from "immer";
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
    reconnectTimeout?: NodeJS.Timeout;
}

function createWs(): WebSocket {
    return new WebSocket(WS_URL);
}

export type SetWsState = (
    setter: ((wsState: WsState) => WsState) | WsState,
) => void;

export function createWsState(setWsState: SetWsState): WsState {
    const ws = createWs();

    const messages = new WsMessageEmitter(ws);

    const cleanup = setupCoreListeners(messages, setWsState) || undefined;

    setupWsReconnection(ws, setWsState);

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

function setupWsReconnection(ws: WebSocket, setWsState: SetWsState) {
    const RECONNECT_DELAY_MS = 2000;

    const reconnect = () => {
        setWsState((base) =>
            produce(base, (state) => {
                state.reconnectTimeout = undefined;
                const ws = createWs();
                state.ws = ws;
                state.messages.setWs(ws);
                setupWsReconnection(ws, setWsState);
            }),
        );
    };

    ws.addEventListener("close", (event) => {
        setWsState((base) =>
            produce(base, (state) => {
                // state.reconnectTimeout = setTimeout();
                console.warn(
                    `WebSocket connection closed, attempting to reconnect in ${
                        RECONNECT_DELAY_MS / 1000
                    } seconds`,
                );
                if (state.reconnectTimeout) {
                    clearTimeout(state.reconnectTimeout);
                }
                state.reconnectTimeout = setTimeout(
                    reconnect,
                    RECONNECT_DELAY_MS,
                );
            }),
        );
    });
}
