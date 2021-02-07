import { createStyles, makeStyles } from "@material-ui/core";
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
    barLen: number;
}

const useStyles = makeStyles((theme) =>
    createStyles({
        cell: ({ barLen }: { barLen: number }) => ({
            [`&:nth-of-type(${barLen}n)`]: {
                borderRightWidth: 2,
                // borderLeftWidth: 2,
            },
            [`&:nth-of-type(${barLen}n+1):not(:nth-of-type(1))`]: {
                borderLeftWidth: 2,
            },
        }),
    }),
);

export default function TrackerGrid({
    ws,
    pattern,
    patternLen,
    barLen,
}: TrackerGridProps) {
    const styles = useStyles({ barLen });

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
                        <TableCell component="td" />
                        {patternLenArr.map((_, step) => (
                            <HeadTableCell
                                key={step}
                                className={styles.cell}
                                component="th"
                            >
                                {step + 1}
                            </HeadTableCell>
                        ))}
                    </HeadTableRow>
                </TableHead>
                <TableBody>
                    {pattern.notes.map((note, i) => (
                        <BeatTableRow key={i}>
                            <NoteTableCell component="th">
                                {note.note}
                            </NoteTableCell>
                            {patternLenArr.map((_, step) => {
                                const isActive = note.beats.includes(step);
                                return (
                                    <BeatCell
                                        key={`${i}-${step}`}
                                        className={styles.cell}
                                        component="td"
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
