import { useEffect } from "react";
import useTrack from "../hooks/use-track";
import { actions, useDispatch } from "../store";

export default function SyncWsToStore() {
    const dispatch = useDispatch();
    const track = useTrack();

    useEffect(() => {
        if (track) {
            dispatch(actions.track.setTrack(track));
        }
    }, [track]);

    return null;
}
