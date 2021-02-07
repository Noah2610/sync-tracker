import Pattern from "../../../../lib/track/pattern";
import BeatCell from "./beat-cell";
import {
    BeatTableRow,
    HeadTableCell,
    HeadTableRow,
    NoteTableCell,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
} from "./styles";

export interface TrackerGridProps {
    pattern: Pattern;
    patternLen: number;
}

export default function TrackerGrid({ pattern, patternLen }: TrackerGridProps) {
    const patternLenArr = new Array(patternLen).fill(undefined);
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <HeadTableRow>
                        <TableCell />
                        {patternLenArr.map((_, step) => (
                            <HeadTableCell key={step}>{step + 1}</HeadTableCell>
                        ))}
                    </HeadTableRow>
                </TableHead>
                <TableBody>
                    {pattern.notes.map((note, i) => (
                        <BeatTableRow key={i}>
                            <NoteTableCell>{note.note}</NoteTableCell>
                            {patternLenArr.map((_, step) => (
                                <BeatCell key={`${i}-${step}`} />
                            ))}
                        </BeatTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
