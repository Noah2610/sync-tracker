import WebSocket from "ws";
import { ClientMessage, parseServerMessage } from "../../lib/message";
import ClientConnection from "./client-connection";

const HOST = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8090;

export function startWs() {
    const server = new WebSocket.Server({ host: HOST, port: PORT }, () =>
        console.log(`WebSocket running on ws://${HOST}:${PORT}`),
    );

    const connections: ClientConnection[] = [];

    function newClient(ws: WebSocket): ClientConnection {
        const id = Math.max(...connections.map((c) => c.client.id), 0) + 1;
        const client = {
            client: {
                id,
                name: `Client ${id}`,
            },
            ws,
        };
        connections.push(client);
        return client;
    }

    function removeClient(client: ClientConnection) {
        let idx: number | null = null;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].client.id === client.client.id) {
                idx = i;
                break;
            }
        }
        if (idx !== null) {
            connections.splice(idx, 1);
        }
    }

    function sendToClient(client: ClientConnection, message: ClientMessage) {
        const messageRaw = JSON.stringify(message);
        client.ws.send(messageRaw);
    }

    server.on("connection", (ws) => {
        const client = newClient(ws);

        console.log(`Client ${client.client.id} connected.`);

        sendToClient(client, {
            kind: "Connected",
            client: client.client,
        });

        client.ws.on("close", (code, reason) => {
            console.log(
                `Client ${client.client.id} disconnected (${code}${
                    reason && " " + reason
                }).`,
            );
            removeClient(client);
        });

        client.ws.on("message", (data) => {
            const message = parseServerMessage(data);
            if (message) {
                switch (message.kind) {
                    case "Message": {
                        for (const other of connections) {
                            sendToClient(other, {
                                kind: "Message",
                                client: client.client,
                                content: message.content,
                            });
                        }
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
