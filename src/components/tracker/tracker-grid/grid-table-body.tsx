import { Pattern, Note, Beat } from "../../../store/types";
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
    const instrument = useInstrument(pattern.instrument) || undefined;

    return (
        <TableBody>
            {/* pattern.notes.map((note, i) => (
                <BeatTableRow key={i}>
                    <NoteCell
                        component="th"
                        note={note.note}
                        instrument={instrument}
                    />
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
            )) */}
        </TableBody>
    );
}
