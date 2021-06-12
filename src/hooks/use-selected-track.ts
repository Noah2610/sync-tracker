import { shallowEqual } from "react-redux";
import { useSelector } from "../store";
import { Track, TrackId } from "../store/types";

export default function useSelectedTrack(): [
    TrackId | undefined,
    Track | undefined,
] {
    return useSelector(
        (state) => [state.track.selectedTrackId, state.track.track],
        (a, b) =>
            a[0] === b[0] &&
            a[1]?.name === b[1]?.name &&
            shallowEqual(a[1]?.config, b[1]?.config) &&
            shallowEqual(a[1]?.patternArrangement, b[1]?.patternArrangement),
    );
}
