import WebSocket from "ws";

export default interface Client {
    id: number;
    ws: WebSocket;
}
