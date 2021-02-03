import Client from "../../lib/client";
import WebSocket from "ws";

export default interface ClientConnection {
    client: Client;
    ws: WebSocket;
}
