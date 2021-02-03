import { useEffect, useState, useRef } from "react";
import Client from "../../lib/client";
import { useWs } from "../ws/ws-context";

export default function Chat() {
    const ws = useWs();
    const [clientId, setClientId] = useState<number | null>(null);
    const [messages, setMessages] = useState<
        {
            client: Client;
            content: string;
        }[]
    >([]);

    const messageContentRef = useRef("");

    const addMessage = (client: Client, content: string) =>
        setMessages((prev) => [...prev, { client, content }]);

    useEffect(() => {
        if (ws) {
            ws.messages.on("Message", (message) =>
                addMessage(message.client, message.content),
            );
        }
    }, [ws]);

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
                    if (ws && messageContentRef.current) {
                        ws.sendMessage({
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
                    <input
                        type="submit"
                        value="Send Message"
                        disabled={clientId === null}
                    />
                </div>
            </form>

            <div>
                {messages.map((message, i) => (
                    <div key={i}>
                        <strong>
                            &lt;{message.client.name || message.client.id}&gt;
                        </strong>{" "}
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
