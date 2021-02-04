import ClientConnection from "./client-connection";

export default interface State {
    connections: ClientConnection[];
}

export function createState(): State {
    return {
        connections: [],
    };
}
