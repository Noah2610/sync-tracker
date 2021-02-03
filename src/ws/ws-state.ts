import WsMessageEmitter from "./ws-message-emitter";
import { ServerMessage } from "../../lib/message";
import sendMessage from "../send-message";

export default interface WsState {
    ws: WebSocket;
    sendMessage(message: ServerMessage): void;
    messages: WsMessageEmitter;
}

function createWs(): WebSocket | null {
    let ws: WebSocket | null = null;

    try {
        ws = new WebSocket("wss://sync-tracker-ws.herokuapp.com");
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
        sendMessage: function (message: ServerMessage) {
            sendMessage(this.ws, message);
        },
        messages: new WsMessageEmitter(ws),
    };

    return state;
}
