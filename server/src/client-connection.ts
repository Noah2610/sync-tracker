import WebSocket from "ws";
import Client from "../../lib/client";
import State from "./state";

export default interface ClientConnection {
    client: Client;
    ws: WebSocket;
}

/**
 * Create a new `ClientConnection` with the given WebSocket.
 * Adds the new client to the state.
 */
export function addClientConnection(
    state: State,
    ws: WebSocket,
): ClientConnection {
    const conn = {
        client: newClient(state),
        ws,
    };
    state.connections.push(conn);
    return conn;
}

/**
 * Removes the stored `ClientConnection` with the given client ID.
 */
export function removeClientConnection(state: State, clientId: number) {
    let idx: number | null = null;
    for (let i = 0; i < state.connections.length; i++) {
        if (state.connections[i].client.id === clientId) {
            idx = i;
            break;
        }
    }
    if (idx !== null) {
        state.connections.splice(idx, 1);
    }
}

function newClient(state: State): Client {
    return {
        id: Math.max(...state.connections.map((conn) => conn.client.id), 0) + 1,
        name: newClientName(state),
    };
}

function newClientName(state: State): string {
    const NAMES = [
        "Composer",
        "Writer",
        "Tracker",
        "Creator",
        "Dude",
        "Worker",
        "Genius",
        "Master",
        "Addict",
        "Player",
        "Pianist",
        "Guitarist",
        "Artist",
    ];
    const ADJECTIVES = [
        "Music",
        "Passionate",
        "Lovable",
        "Likable",
        "Amazing",
        "Cool",
        "Unstoppable",
        "Unbeatable",
        "Perfect",
        "Go-getter",
        "Junior",
        "Senior",
        "Hardcore",
        "Genius",
        "Strong",
        "Grand",
    ];
    const MAX_LOOP = 100;

    const pick = (list: string[]): string =>
        list[Math.floor(Math.random() * list.length)];

    const genName = (): string => `${pick(ADJECTIVES)} ${pick(NAMES)}`;

    const isNameTaken = (name: string): boolean =>
        !!state.connections.find((conn) => conn.client.name === name);

    let name = genName();
    let i = 0;
    while (isNameTaken(name) && i < MAX_LOOP) {
        name = genName();
        i++;
    }
    return name;
}
