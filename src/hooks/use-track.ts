import { shallowEqual } from "react-redux";
import { useSelector } from "../store";
import { Track, TrackId } from "../store/types";

const areTracksEqual = (a: Track | undefined, b: Track | undefined): boolean =>
    a?.name === b?.name &&
    shallowEqual(a?.config, b?.config) &&
    shallowEqual(a?.patternArrangement, b?.patternArrangement);

export default function useTrack(
    trackId: TrackId | undefined,
): Track | undefined {
    return useSelector(
        (state) =>
            trackId === undefined ? undefined : state.track.tracks[trackId],
        areTracksEqual,
    );
}
