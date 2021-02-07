import { List } from "@material-ui/core";
import Pattern, { PatternId } from "../../../../lib/track/pattern";
import PatternListItem from "./pattern-list-item";

export interface PatternListProps {
    patterns: Pattern[];
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
            {patterns.map((pattern, i) => (
                <PatternListItem
                    key={i}
                    pattern={pattern}
                    isSelected={pattern.id === selectedPatternId}
                    onClick={() => selectPattern(pattern.id)}
                />
            ))}
        </List>
    );
}
