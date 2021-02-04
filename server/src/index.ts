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
                        for (const other of state.connections) {
                            sendMessage(other, {
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
