import { useEffect, useState, useRef } from "react";
import { parseClientMessage } from "../../lib/message";
import sendMessage from "../send-message";

export default function Home() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [clientId, setClientId] = useState<number | null>(null);
    const [messages, setMessages] = useState<
        {
            clientId: number;
            content: string;
        }[]
    >([]);

    const messageContentRef = useRef("");

    const addMessage = (clientId: number, content: string) =>
        setMessages((prev) => [...prev, { clientId, content }]);

    const connectWs = () => {
        let ws: WebSocket | null = null;

        try {
            ws = new WebSocket("wss://sync-tracker-ws.herokuapp.com");
        } catch (e) {
            console.error(e);
        }

        if (!ws) {
            console.warn("Retrying WebSocket connection in 2 seconds...");
            setTimeout(connectWs, 2000);
            return;
        }

        ws.addEventListener("message", (event) => {
            if (event.data) {
                const message = parseClientMessage(event.data);
                if (message) {
                    switch (message.kind) {
                        case "Connected": {
                            setClientId(message.id);
                            break;
                        }
                        case "Message": {
                            addMessage(message.clientId, message.content);
                            break;
                        }
                        default: {
                            console.error("Unknown ClientMessage", message);
                        }
                    }
                }
            }
        });

        setWs(ws);
    };

    useEffect(() => {
        connectWs();
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    if (!ws) {
        return <>Attempting to connect to WebSocket...</>;
    }

    return (
        <>
            {clientId && (
                <div>
                    Your client ID: <strong>{clientId}</strong>
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (messageContentRef.current) {
                        sendMessage(ws, {
                            kind: "Message",
                            content: messageContentRef.current,
                        });
                    }
                }}
            >
                <div>
                    <label htmlFor="messageContent">Message: </label>
                    <input
                        type="text"
                        name="messageContent"
                        onKeyUp={(e) =>
                            (messageContentRef.current = e.currentTarget.value)
                        }
                    />
                </div>
                <div>
                    <input type="submit" value="Send Message" />
                </div>
            </form>

            <div>
                {messages.map((message, i) => (
                    <div key={i}>
                        <strong>&lt;{message.clientId}&gt;</strong>{" "}
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
