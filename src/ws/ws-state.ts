import { Dispatch, SetStateAction } from "react";
import { ServerMessage } from "../../lib/message";
import Client from "../../lib/client";
import WsMessageEmitter from "./ws-message-emitter";

const WS_URL =
    process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || "ws://0.0.0.0:8090";

export default interface WsState {
    ws: WebSocket;
    client?: Client;
    connectedClients: Client[];
    sendMessage(message: ServerMessage): void;
    messages: WsMessageEmitter;
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

export function createWsState(
    update: Dispatch<SetStateAction<WsState>>,
): WsState {
    const ws = createWs();

    if (!ws) {
        throw new Error("Couldn't create WebSocket.");
    }

    const state: WsState = {
        ws,
        sendMessage(message: ServerMessage) {
            ws.send(JSON.stringify(message));
        },
        client: undefined,
        connectedClients: [],
        messages: new WsMessageEmitter(ws),
    };

    setupCoreListeners(state, update);

    return state;
}

function setupCoreListeners(
    state: WsState,
    update: Dispatch<SetStateAction<WsState>>,
) {
    state.messages.on("Connected", (message) => {
        update((prev) => ({
            ...prev,
            client: message.client,
        }));
    });

    state.messages.on("UpdateClient", (message) => {
        let existingClientIdx: number | null = null;
        for (let idx = 0; idx < state.connectedClients.length; idx++) {
            if (state.connectedClients[idx].id === message.client.id) {
                existingClientIdx = idx;
                break;
            }
        }
        if (existingClientIdx === null) {
            update((prev) => ({
                ...prev,
                connectedClients: [...prev.connectedClients, message.client],
            }));
        } else {
            update((prev) => {
                const connectedClients = prev.connectedClients;
                connectedClients[existingClientIdx as number] = {
                    ...message.client,
                };
                return {
                    ...prev,
                    connectedClients,
                };
            });
        }
    });
}
