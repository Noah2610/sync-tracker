import { Pattern, Notes, NoteId, BeatId } from "../../../store/types";
import BeatCell from "./beat-cell";
import NoteCell from "./note-cell";
import { BeatTableRow, TableBody } from "./styles";
import useInstrument, { ToneInstrument } from "../../../hooks/use-instrument";

export interface GridTableBodyProps {
    pattern: Pattern;
    patternLen: number;
    toggleBeat: ({
        note,
        beat,
        isActive,
    }: {
        note: NoteId;
        beat: BeatId;
        isActive: boolean;
    }) => void;
    cellClassName?: string;
}

const sortNotes = (notes: Notes): NoteId[] =>
    (Object.keys(notes) as NoteId[]).sort(
        (a, b) => notes[a]!.order - notes[b]!.order,
    ) as NoteId[];

export default function GridTableBody({
    pattern,
    patternLen,
    toggleBeat,
    cellClassName,
}: GridTableBodyProps) {
    const instrument = useInstrument(pattern.instrument) || undefined;
    const noteIds = sortNotes(pattern.notes);

    return (
        <TableBody>
            {noteIds.map((note) => (
                <BeatTableRow key={note}>
                    <NoteCell
                        component="th"
                        note={note}
                        instrument={instrument}
                    />
                    {Array.from({ length: patternLen }, (_, step) => {
                        const beatId = step;
                        const toggle = (isActive: boolean) =>
                            toggleBeat({ beat: beatId, note, isActive });
                        return (
                            <BeatCell
                                key={`${note}-${beatId}`}
                                className={cellClassName}
                                component="td"
                                beat={beatId}
                                note={note}
                                toggle={toggle}
                            />
                        );
                    })}
                </BeatTableRow>
            ))}
        </TableBody>
    );
}
