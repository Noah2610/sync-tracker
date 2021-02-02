import { useEffect, useState } from "react";
import { parseClientMessage } from "../../lib/message";
import sendMessage from "../send-message";

const WS_PORT = 8090;

export default function Home() {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${location.hostname}:${WS_PORT}`);

        ws.addEventListener("message", (event) => {
            if (event.data) {
                const message = parseClientMessage(event.data);
                if (message) {
                    switch (message.kind) {
                        case "Connected": {
                            console.log(`Connected as user ${message.id}`);
                            break;
                        }
                        case "Message": {
                            console.log(
                                `<${message.userId}> ${message.content}`,
                            );
                            break;
                        }
                    }
                }
            }
        });

        setWs(ws);

        return () => ws.close();
    }, []);

    return (
        <>
            {ws && (
                <button
                    onClick={() =>
                        sendMessage(ws, {
                            kind: "Message",
                            userId: 0,
                            content: "hello",
                        })
                    }
                >
                    Click me!
                </button>
            )}
        </>
    );
}
