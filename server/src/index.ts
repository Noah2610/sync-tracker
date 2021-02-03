import WebSocket from "ws";
import Client from "../../lib/client";
import { ClientMessage, parseServerMessage } from "../../lib/message";

const HOST = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8090;

export function startWs() {
    const server = new WebSocket.Server({ host: HOST, port: PORT }, () =>
        console.log(`WebSocket running on ws://${HOST}:${PORT}`),
    );

    const clients: Client[] = [];

    function newClient(ws: WebSocket): Client {
        const id = Math.max(...clients.map((c) => c.id), 0) + 1;
        console.log(id);
        const client = {
            id,
            ws,
        };
        clients.push(client);
        return client;
    }

    function removeClient(client: Client) {
        let idx: number | null = null;
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === client.id) {
                idx = i;
                break;
            }
        }
        if (idx !== null) {
            clients.splice(idx, 1);
        }
    }

    function sendToClient(client: Client, message: ClientMessage) {
        const messageRaw = JSON.stringify(message);
        client.ws.send(messageRaw);
    }

    server.on("connection", (ws) => {
        const client = newClient(ws);

        console.log(`Client ${client.id} connected.`);

        sendToClient(client, {
            kind: "Connected",
            id: client.id,
        });

        client.ws.on("close", (code, reason) => {
            console.log(
                `Client ${client.id} disconnected (${code}${
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
                        for (const other of clients) {
                            sendToClient(other, {
                                kind: "Message",
                                userId: client.id,
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
            console.log("MESSAGE FROM CLIENT: ", message);
        });
    });

    setInterval(() => console.log(`client count: ${clients.length}`), 1000);
}
