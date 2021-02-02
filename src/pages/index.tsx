import { useEffect, useState } from "react";
import sendMessage from "../send-message";

const WS_PORT = 8090;

export default function Home() {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://${location.hostname}:${WS_PORT}`);

        ws.addEventListener("message", (event) => {
            if (event.data) {
                const message = JSON.parse(event.data);
                console.log(message);
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
                            Message: {
                                userId: 0,
                                content: "hello",
                            },
                        })
                    }
                >
                    Click me!
                </button>
            )}
        </>
    );
}
