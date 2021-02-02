import { useEffect, useState } from "react";

const WS_PORT = 8090;

export default function Home() {
    useEffect(() => {
        const ws = new WebSocket(`ws://${location.hostname}:${WS_PORT}`);

        ws.addEventListener("message", (event) => {
            if (event.data) {
                const message = JSON.parse(event.data);
                console.log(message);
            }
        });

        return () => ws.close();
    }, []);

    return <>Hello World!</>;
}
