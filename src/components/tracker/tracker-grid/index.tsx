import { useEffect } from "react";
import Beat from "../../../../lib/track/beat";
import Note from "../../../../lib/track/note";
import Pattern from "../../../../lib/track/pattern";
import WsState from "../../../ws/ws-state";
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
    ws: WsState;
    pattern: Pattern;
    patternLen: number;
}

export default function TrackerGrid({
    ws,
    pattern,
    patternLen,
}: TrackerGridProps) {
    useEffect(() => {}, []);

    const patternLenArr = new Array(patternLen).fill(undefined);

    const toggleBeat = (note: Note, step: Beat, active: boolean) =>
        ws.sendMessage({
            kind: "UpdateTrackBeat",
            patternId: pattern.id,
            note,
            step,
            active,
        });

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
                            {patternLenArr.map((_, step) => {
                                const isActive = note.beats.includes(step);
                                return (
                                    <BeatCell
                                        key={`${i}-${step}`}
                                        isActive={isActive}
                                        toggle={() =>
                                            toggleBeat(
                                                note.note,
                                                step,
                                                !isActive,
                                            )
                                        }
                                    />
                                );
                            })}
                        </BeatTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
