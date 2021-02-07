import { createStyles, makeStyles, TableCellProps } from "@material-ui/core";
import { useCallback } from "react";
import { Time } from "tone/Tone/core/type/Units";
import Note from "../../../../lib/track/note";
import useSynth from "../../../hooks/use-synth";
import { NoteTableCell } from "./styles";

export type NoteCellProps = {
    note: Note;
} & TableCellProps;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            cursor: "pointer",
        },
    }),
);

export default function NoteCell({ note, children, ...props }: NoteCellProps) {
    const synth = useSynth({
        volume: 50.0,
    });
    const styles = useStyles();

    const playNote = useCallback(() => synth?.triggerAttack(note, 0), [
        note,
        synth,
    ]);
    const stopNote = useCallback(() => synth?.triggerRelease(0), [note, synth]);

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
