import { List } from "@material-ui/core";
import { Pattern, PatternId } from "../../../../store/types";
import PatternListItem from "./pattern-list-item";

export interface PatternListProps {
    patterns: Record<PatternId, Pick<Pattern, "name" | "order">>;
    selectedPatternId?: PatternId;
    selectPattern: (patternId: PatternId) => void;
}

export default function PatternList({
    patterns,
    selectedPatternId,
    selectPattern,
}: PatternListProps) {
    return (
        <List>
            {Object.keys(patterns).map((patternId) => (
                <PatternListItem
                    key={patternId}
                    pattern={patterns![patternId]}
                    isSelected={patternId === selectedPatternId}
                    onClick={() => selectPattern(patternId)}
                />
            ))}
        </List>
    );
}
