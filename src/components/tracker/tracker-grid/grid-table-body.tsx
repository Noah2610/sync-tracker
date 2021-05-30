import {
    Pattern,
    Note,
    Notes,
    NoteId,
    Beat,
    BeatId,
} from "../../../store/types";
import BeatCell from "./beat-cell";
import NoteCell from "./note-cell";
import { BeatTableRow, TableBody } from "./styles";
import useInstrument, { ToneInstrument } from "../../../hooks/use-instrument";

export interface GridTableBodyProps {
    pattern: Pattern;
    patternLen: number;
    toggleBeat: ({
        note,
        step,
        active,
    }: {
        note: NoteId;
        step: BeatId;
        active: boolean;
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
            {noteIds.map((note, i) => (
                <BeatTableRow key={i}>
                    <NoteCell
                        component="th"
                        note={note}
                        instrument={instrument}
                    />
                    {Array.from({ length: patternLen }, (_, step) => {
                        const beatId = step;
                        const beat = pattern.notes[note]!.beats[beatId];
                        const isActive = beat?.isActive || false;
                        return (
                            <BeatCell
                                key={`${i}-${beatId}`}
                                className={cellClassName}
                                component="td"
                                isActive={isActive}
                                toggle={() =>
                                    toggleBeat({
                                        note: note,
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
