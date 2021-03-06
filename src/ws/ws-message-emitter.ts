import {
    parseClientMessage,
    ClientMessage,
    ClientMessageOfKind,
} from "../../lib/message";

type WsMessageListener<K extends ClientMessage["kind"]> = (
    message: ClientMessageOfKind<K>,
) => void;

/**
 * The `WsMessageEmitter` is responsible for listening and parsing
 * of incoming WebSocket messages (`ClientMessage`), and then
 * emitting any registered event listeners.
 */
export default class WsMessageEmitter {
    private ws: WebSocket;
    private events: {
        [K in ClientMessage["kind"]]?: WsMessageListener<K>[];
    };

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.events = {};

        this.setupWsListener();
    }

    /**
     * Register an event listener for the given kind of WS message.
     */
    public on<K extends ClientMessage["kind"]>(
        kind: K,
        listener: WsMessageListener<K>,
    ) {
        this.getEventsOfKind(kind).push(listener);
    }

    /**
     * Remove a registered event listener for the given kind of WS message.
     */
    public remove<K extends ClientMessage["kind"]>(
        kind: K,
        listener: WsMessageListener<K>,
    ) {
        const events = this.getEventsOfKind(kind);
        let idx = events.indexOf(listener);
        while (idx > -1) {
            events.splice(idx, 1);
            idx = events.indexOf(listener);
        }
    }

    /**
     * Emit an event based on the WS message kind.
     */
    private emit<K extends ClientMessage["kind"]>(
        message: ClientMessageOfKind<K>,
    ) {
        this.getEventsOfKind(message.kind).forEach((listener) =>
            listener(message),
        );
    }

    private getEventsOfKind<K extends ClientMessage["kind"]>(
        kind: K,
    ): WsMessageListener<K>[] {
        if (!this.events[kind]) {
            this.events[kind] = [];
        }
        return this.events[kind] as WsMessageListener<K>[];
    }

    private setupWsListener() {
        this.ws.addEventListener("message", (event) => {
            if (event.data) {
                const message = parseClientMessage(event.data);
                if (
                    message &&
                    message.kind &&
                    Object.keys(this.events).includes(message.kind)
                ) {
                    this.emit(message);
                } else {
                    console.error("Unknown ClientMessage", message);
                }
            }
        });

        this.ws.addEventListener("close", (event) => {
            console.log(
                `WebSocket connection closed: ${event.code} ${event.reason}`,
            );
            this.cleanup();
        });
    }

    private cleanup() {
        for (const kind of Object.keys(
            this.events,
        ) as ClientMessage["kind"][]) {
            this.events[kind] = [];
        }
    }
}
