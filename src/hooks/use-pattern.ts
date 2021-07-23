import { shallowEqual } from "react-redux";
import safeObjectKeys from "../util/safeObjectKeys";
import { useSelector } from "../store";
import { Pattern, PatternId } from "../store/types";

const arePatternsEqual = (
    a: Pattern | undefined,
    b: Pattern | undefined,
): boolean =>
    a?.name === b?.name &&
    a?.order === b?.order &&
    areNotesEqual(a?.notes, b?.notes);

const areNotesEqual = (a: Notes | undefined, b: Notes | undefined): boolean =>
    shallowEqual(
        a && safeObjectKeys(a).map((note) => a[note]!.order),
        b && safeObjectKeys(b).map((note) => b[note]!.order),
    );

export default function usePattern(
    patternId: PatternId | undefined,
): Pattern | undefined {
    return useSelector(
        (state) =>
            patternId === undefined
                ? undefined
                : state.track.selectedTrack &&
                  state.track.tracks[state.track.selectedTrack.id]?.patterns[
                      patternId
                  ],
        arePatternsEqual,
    );
}
