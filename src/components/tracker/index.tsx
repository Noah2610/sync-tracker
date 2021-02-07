import { useEffect, useState } from "react";
import Track from "../../../lib/track";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";

export default function Tracker() {
    const ws = useWs();
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        if (ws) {
            ws.messages.on("UpdateTrack", ({ track }) => setTrack(track));
        }
    }, []);

    if (!ws) {
        return <Loading />;
    }

    if (!track) {
        return (
            <>
                <Loading />
                Waiting for track data...
            </>
        );
    }

    console.log(track);

    return <>TRACKER!</>;
}
