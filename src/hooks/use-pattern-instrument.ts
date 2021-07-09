import { useSelector } from "../store";
import { Instrument, PatternId } from "../store/types";

const areInstrumentsEqual = (
    a: Instrument | undefined,
    b: Instrument | undefined,
): boolean => a?.name === b?.name;

export default function usePatternInstrument(
    patternId: PatternId | undefined,
): Instrument | undefined {
    return useSelector(
        (state) =>
            patternId === undefined
                ? undefined
                : state.track.patterns[patternId]?.instrument,
        areInstrumentsEqual,
    );
}
