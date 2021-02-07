import { createStyles, makeStyles, TableCellProps } from "@material-ui/core";
import { useCallback } from "react";
import Note from "../../../../lib/track/note";
import { NoteTableCell } from "./styles";
import { ToneInstrument } from "../../../hooks/use-instrument";

export type NoteCellProps = {
    note: Note;
    instrument?: ToneInstrument;
} & TableCellProps;

const useStyles = makeStyles((_theme) =>
    createStyles({
        root: {
            cursor: "pointer",
        },
    }),
);

export default function NoteCell({
    note,
    instrument,
    children,
    ...props
}: NoteCellProps) {
    const styles = useStyles();

    const playNote = useCallback(() => {
        if (instrument) {
            if (instrument.name === "NoiseSynth") {
                instrument?.triggerAttack();
            } else {
                instrument?.triggerAttack(note, 0);
            }
        }
    }, [note, instrument]);
    const stopNote = useCallback(() => instrument?.triggerRelease(0), [
        note,
        instrument,
    ]);

    return (
        <NoteTableCell
            {...props}
            className={styles.root}
            onMouseDown={playNote}
            onMouseUp={stopNote}
            onMouseLeave={stopNote}
        >
            {note}
            {children}
        </NoteTableCell>
    );
}
