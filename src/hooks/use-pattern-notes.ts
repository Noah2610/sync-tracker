import { shallowEqual } from "react-redux";
import safeObjectKeys from "../util/safeObjectKeys";
import { useSelector } from "../store";
import { Notes, PatternId } from "../store/types";

const areNotesEqual = (a: Notes | undefined, b: Notes | undefined): boolean => {
    const aNoteIds = a && safeObjectKeys(a);
    const bNoteIds = b && safeObjectKeys(b);

    const flattenNotes = (notes: Notes): string[] =>
        safeObjectKeys(notes).reduce<string[]>(
            (acc, noteId) => [
                ...acc,
                ...safeObjectKeys(notes[noteId]!.beats).map(
                    (beatId) =>
                        `${noteId}-${beatId}-${
                            notes[noteId]!.beats[beatId]!.isActive
                        }`,
                ),
            ],
            [],
        );

    return (
        shallowEqual(aNoteIds, bNoteIds) &&
        shallowEqual(
            a && aNoteIds && flattenNotes(a),
            b && bNoteIds && flattenNotes(b),
        )
    );
};

export default function usePatternNotes(
    patternId: PatternId | undefined,
): Notes | undefined {
    return useSelector((state) => {
        if (patternId === undefined) {
            return undefined;
        }
        const pattern = state.track.patterns[patternId];
        return pattern?.notes;
    }, areNotesEqual);
}
