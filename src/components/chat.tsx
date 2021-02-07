import { useEffect, useRef, useState } from "react";
import Client from "../../lib/client";
import { ClientMessageOfKind } from "../../lib/message";
import { useWs } from "../ws/ws-context";

export default function Chat() {
    const ws = useWs();
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
            const listener = (message: ClientMessageOfKind<"Message">) =>
                addMessage(message.client, message.content);
            ws.messages.on("Message", listener);
            return () => ws.messages.remove("Message", listener);
        }
    }, []);

    return (
        <>
            {ws && ws.client && (
                <div>
                    {ws.client.name ? (
                        <>
                            Your client Name: <strong>{ws.client.name}</strong>
                        </>
                    ) : (
                        <>
                            Your client ID<strong>{ws.client.id}</strong>
                        </>
                    )}
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
                    <input type="submit" value="Send Message" disabled={!ws} />
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
