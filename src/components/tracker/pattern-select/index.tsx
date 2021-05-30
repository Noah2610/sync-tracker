import { shallowEqual } from "react-redux";
import { actions, useDispatch, useSelector, State } from "../../../store";
import { PatternId, Patterns } from "../../../store/types";
import PatternList from "./pattern-list";

const selector = (state: State) => ({
    patterns: state.track.patterns,
    selectedPatternId: state.track.selectedPatternId,
});

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
        <PatternList
            patterns={patterns}
            selectedPatternId={selectedPatternId}
            selectPattern={selectPattern}
        />
    );
}
