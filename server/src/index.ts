import WebSocket from "ws";
import { ClientMessage, parseServerMessage } from "../../lib/message";
import ClientConnection from "./client-connection";
import State from "./state";

const HOST = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8090;

export function startWs(state: State) {
    const server = new WebSocket.Server({ host: HOST, port: PORT }, () =>
        console.log(`WebSocket running on ws://${HOST}:${PORT}`),
    );

    function sendMessage(client: ClientConnection, message: ClientMessage) {
        const messageRaw = JSON.stringify(message);
        client.ws.send(messageRaw);
    }

    server.on("connection", (ws) => {
        const client = state.addClientConnection(ws);

        console.log(`Client ${client.client.id} connected.`);

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

        client.ws.on("close", (code, reason) => {
            console.log(
                `Client ${client.client.id} disconnected (${code}${
                    reason && " " + reason
                }).`,
            );
            state.removeClientConnection(client.client.id);
        });

        client.ws.on("message", (data) => {
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

                    default: {
                        console.error("Unknown ServerMessage", message);
                    }
                }
            }
        });
    });
}
