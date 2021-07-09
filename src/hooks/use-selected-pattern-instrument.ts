import { useSelector } from "../store";
import { Instrument, PatternId } from "../store/types";
import usePatternInstrument from "./use-pattern-instrument";

export default function useSelectedPatternInstrument():
    | [PatternId, Instrument]
    | [] {
    const patternId = useSelector((state) => state.track.selectedPatternId);
    const instrument = usePatternInstrument(patternId);

    if (patternId === undefined || instrument === undefined) {
        return [];
    }

    return [patternId, instrument];
}
