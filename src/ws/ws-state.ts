import { ServerMessage } from "../../lib/message";
import WsMessageEmitter from "./ws-message-emitter";
import WsClient from "./ws-client";

const WS_URL =
    process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || "ws://0.0.0.0:8090";

export default interface WsState {
    ws: WebSocket;
    client?: WsClient;
    connectedClients: WsClient[];
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

export function createWsState(): WsState {
    const ws = createWs();

    if (!ws) {
        throw new Error("Couldn't create WebSocket.");
    }

    const state = {
        ws,
        sendMessage(message: ServerMessage) {
            ws.send(JSON.stringify(message));
        },
        client: undefined,
        connectedClients: [],
        messages: new WsMessageEmitter(ws),
    };

    return state;
}
