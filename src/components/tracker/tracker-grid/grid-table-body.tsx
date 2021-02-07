import Beat from "../../../../lib/track/beat";
import Note from "../../../../lib/track/note";
import Pattern from "../../../../lib/track/pattern";
import BeatCell from "./beat-cell";
import { BeatTableRow, NoteTableCell, TableBody } from "./styles";

export interface GridTableBodyProps {
    pattern: Pattern;
    patternLen: number;
    toggleBeat: ({
        note,
        step,
        active,
    }: {
        note: Note;
        step: Beat;
        active: boolean;
    }) => void;
    cellClassName?: string;
}

export default function GridTableBody({
    pattern,
    patternLen,
    toggleBeat,
    cellClassName,
}: GridTableBodyProps) {
    return (
        <TableBody>
            {pattern.notes.map((note, i) => (
                <BeatTableRow key={i}>
                    <NoteTableCell component="th">{note.note}</NoteTableCell>
                    {Array.from({ length: patternLen }, (_, step) => {
                        const isActive = note.beats.includes(step);
                        return (
                            <BeatCell
                                key={`${i}-${step}`}
                                className={cellClassName}
                                component="td"
                                isActive={isActive}
                                toggle={() =>
                                    toggleBeat({
                                        note: note.note,
                                        step,
                                        active: !isActive,
                                    })
                                }
                            />
                        );
                    })}
                </BeatTableRow>
            ))}
        </TableBody>
    );
}
