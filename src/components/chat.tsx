import { useEffect, useState, useRef } from "react";
import { useWs } from "../ws/ws-context";

export default function Chat() {
    const ws = useWs();
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

    useEffect(() => {
        if (ws) {
            ws.messages.on("Connected", (message) => setClientId(message.id));
            ws.messages.on("Message", (message) =>
                addMessage(message.clientId, message.content),
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
                        <strong>&lt;{message.clientId}&gt;</strong>{" "}
                        <span>{message.content}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
