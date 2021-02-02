import WebSocket from "ws";
import Client from "./client";
import { ClientMessage } from "./message";

const HOST = "0.0.0.0";
const PORT = 8090;

const server = new WebSocket.Server({ host: HOST, port: PORT }, () =>
    console.log(`WebSocket running on ws://${HOST}:${PORT}`),
);

const clients: Client[] = [];

function newClient(ws: WebSocket): Client {
    const id =
        clients.reduce((largest, client) => Math.max(largest, client.id), 0) +
        1;
    const client = {
        id,
        ws,
    };
    clients.push(client);
    return client;
}

function sendToClient(client: Client, message: ClientMessage) {
    const messageRaw = JSON.stringify(message);
    client.ws.send(messageRaw);
}

server.on("connection", (ws) => {
    const client = newClient(ws);

    console.log(`Client ${client.id} connected.`);

    sendToClient(client, {
        Connected: { id: client.id },
    });

    client.ws.on("close", (code, reason) => {
        console.log(
            `Client ${client.id} disconnected (${code}${
                reason && " " + reason
            }).`,
        );
    });
});
