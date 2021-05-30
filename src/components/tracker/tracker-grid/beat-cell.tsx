import { memo } from "react";
import { createStyles, makeStyles, TableCellProps } from "@material-ui/core";
import { useSelector } from "../../../store";
import { BeatId, NoteId } from "../../../store/types";
import { BeatTableCell } from "./styles";

export type BeatCellProps = {
    beat: BeatId;
    note: NoteId;
    toggle: (isActive: boolean) => void;
} & TableCellProps;

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: ({ isActive }: { isActive: boolean }) =>
                isActive ? theme.tracker.colors.cells.active.main : "inherit",
        },
    }),
);

export default memo(
    function BeatCell({ beat, note, toggle, ...props }: BeatCellProps) {
        const isActive = useSelector(
            (state) =>
                (state.track.selectedPatternId &&
                    state.track.patterns[state.track.selectedPatternId]?.notes[
                        note
                    ]?.beats[beat]?.isActive) ||
                false,
        );
        const styles = useStyles({ isActive });
        const className = `${styles.root} ${props.className || ""}`;

        return (
            <BeatTableCell
                {...props}
                className={className}
                onClick={() => toggle(!isActive)}
            />
        );
    },
    (a, b) => a.beat === b.beat && a.note === b.note,
);
