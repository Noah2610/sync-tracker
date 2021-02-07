import WebSocket from "ws";
import ClientConnection from "./client-connection";
import handleMessage from "./handle-message";
import sendMessage from "./send-message";
import State from "./state";

import Track from "../../lib/track";
import trackExample from "../track-example.json";

const HOST = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8090;

export function startWs(state: State) {
    const server = createServer();

    /**
     * Handle a new client connection.
     */
    function handleConnection(ws: WebSocket) {
        const client = state.addClientConnection(ws);
        console.log(`Client ${client.client.id} connected.`);

        informNewClient(client);

        // TODO
        sendMessage(client, {
            kind: "UpdateTrack",
            track: trackExample as Track,
        });

        client.ws.on("close", (code, reason) => {
            handleClose(client, { code, reason });
        });

        client.ws.on("message", (data) => {
            handleMessage(state, client, data);
        });
    }

    /**
     * Handle a closed client connection.
     */
    function handleClose(
        client: ClientConnection,
        { code, reason }: { code: number; reason: string },
    ) {
        console.log(
            `Client ${client.client.id} disconnected (${code}${
                reason && " " + reason
            }).`,
        );
        state.removeClientConnection(client.client.id);
        // Inform all other connections of client disconnection.
        state.connections.forEach((conn) => {
            sendMessage(conn, {
                kind: "UpdateClient",
                client: client.client,
                disconnected: true,
            });
        });
    }

    /**
     * Inform newly connected client of relevant data.
     * Inform every existing connection of new client.
     */
    function informNewClient(client: ClientConnection) {
        sendMessage(client, {
            kind: "Connected",
            client: client.client,
        });
        state.connections.forEach((conn) => {
            // Inform new client of all existing connections.
            sendMessage(client, {
                kind: "UpdateClient",
                client: conn.client,
            });
            // Inform all existing connections of new client.
            sendMessage(conn, {
                kind: "UpdateClient",
                client: client.client,
            });
        });
    }

    server.on("connection", (ws) => {
        handleConnection(ws);
    });
}

function createServer(): WebSocket.Server {
    return new WebSocket.Server({ host: HOST, port: PORT }, () =>
        console.log(`WebSocket running on ws://${HOST}:${PORT}`),
    );
}
