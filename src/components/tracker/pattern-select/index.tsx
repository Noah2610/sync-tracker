import { shallowEqual } from "react-redux";
import { Box } from "@material-ui/core";
import { actions, useDispatch, useSelector, State } from "../../../store";
import { PatternId, Patterns } from "../../../store/types";
import PatternList from "./pattern-list";
import NewPatternButton from "./new-pattern-button";

const selector = (state: State) => {
    const track =
        state.track.selectedTrack &&
        state.track.tracks[state.track.selectedTrack?.id];
    return {
        patterns: track?.patterns || {},
        selectedPatternId: state.track.selectedTrack?.selectedPattern?.id,
    };
};

type SelectorReturn = ReturnType<typeof selector>;

const selectorEqual = (a: SelectorReturn, b: SelectorReturn) => {
    const mapPatterns = (patterns: Patterns) =>
        Object.keys(patterns).map(
            (patternId) =>
                `${patternId}-${patterns[patternId]!.name}-${
                    patterns[patternId]!.order
                }`,
        );
    return (
        a.selectedPatternId === b.selectedPatternId &&
        shallowEqual(Object.keys(a.patterns), Object.keys(b.patterns)) &&
        shallowEqual(mapPatterns(a.patterns), mapPatterns(b.patterns))
    );
};

export default function PatternSelect() {
    const { patterns, selectedPatternId } = useSelector(
        selector,
        selectorEqual,
    );

    const dispatch = useDispatch();

    const selectPattern = (id: PatternId) =>
        dispatch(actions.track.selectPattern(id));

    return (
        <Box display="flex" flexDirection="column">
            <PatternList
                patterns={patterns}
                selectedPatternId={selectedPatternId}
                selectPattern={selectPattern}
            />
            <NewPatternButton />
        </Box>
    );
}
