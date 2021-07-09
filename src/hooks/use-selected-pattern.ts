import { useSelector } from "../store";
import { Pattern, PatternId } from "../store/types";
import usePattern from "./use-pattern";

export default function useSelectedPattern(): [PatternId, Pattern] | [] {
    const patternId = useSelector((state) => state.track.selectedPatternId);
    const pattern = usePattern(patternId);

    if (patternId === undefined || pattern === undefined) {
        return [];
    }

    return [patternId, pattern];
}
