import { useSelector } from "../store";
import { Track, TrackId } from "../store/types";
import useTrack from "./use-track";

export default function useSelectedTrack(): [TrackId, Track] | [] {
    const trackId = useSelector((state) => state.track.selectedTrack?.id);
    const track = useTrack(trackId);

    if (trackId === undefined || track === undefined) {
        return [];
    }

    return [trackId, track];
}
