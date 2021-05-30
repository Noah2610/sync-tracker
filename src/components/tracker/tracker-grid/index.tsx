import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core";
import { useSelector, State } from "../../../store";
import { BeatId, NoteId } from "../../../store/types/pattern";
import useFirebaseDispatch from "../../../firebase/use-firebase-dispatch";
import GridTableBody from "./grid-table-body";
import GridTableHead from "./grid-table-head";
import { Table, TableContainer } from "./styles";

const useStyles = makeStyles((_theme) =>
    createStyles({
        cell: ({ barLen }: { barLen: number }) => ({
            [`&:nth-of-type(${barLen}n)`]: {
                borderRightWidth: 2,
            },
            [`&:nth-of-type(${barLen}n+1):not(:nth-of-type(1))`]: {
                borderLeftWidth: 2,
            },
        }),
    }),
);

const selector = (state: State) => ({
    trackConfig: state.track.track?.config,
    trackId: state.track.selectedTrackId,
    patternId: state.track.selectedPatternId,
    pattern: state.track.selectedPatternId
        ? state.track.patterns[state.track.selectedPatternId]
        : undefined,
});

type SelectorReturn = ReturnType<typeof selector>;

const selectorEqual = (a: SelectorReturn, b: SelectorReturn) =>
    a.patternId === b.patternId &&
    shallowEqual(
        a.pattern && Object.keys(a.pattern.notes),
        b.pattern && Object.keys(b.pattern.notes),
    ) &&
    shallowEqual(
        a.pattern &&
            Object.keys(a.pattern.notes).map(
                (note) => a.pattern?.notes[note as NoteId]!.order,
            ),
        b.pattern &&
            Object.keys(b.pattern.notes).map(
                (note) => b.pattern?.notes[note as NoteId]!.order,
            ),
    ) &&
    shallowEqual(a.trackConfig, b.trackConfig);

export default function TrackerGrid() {
    const { trackConfig, trackId, patternId, pattern } = useSelector(
        selector,
        selectorEqual,
    );

    const styles = useStyles({ barLen: trackConfig?.barLen ?? 4 });

    const firebaseDispatch = useFirebaseDispatch();

    const toggleBeat = useCallback(
        ({
            note,
            beat,
            isActive,
        }: {
            note: NoteId;
            beat: BeatId;
            isActive: boolean;
        }) => {
            if (trackId !== undefined && patternId !== undefined) {
                firebaseDispatch
                    .setBeat({
                        id: beat,
                        trackId,
                        patternId,
                        noteId: note,
                        doc: {
                            isActive,
                        },
                    })
                    .catch(console.error);
            } else {
                console.error(
                    "Can't update firebase beat because trackId or patternId aren't set",
                );
            }
        },
        [trackId, patternId],
    );

    if (!trackConfig || !pattern) {
        return null;
    }

    return (
        <TableContainer>
            <Table>
                <GridTableHead
                    patternLen={trackConfig.patternLen}
                    cellClassName={styles.cell}
                />
                <GridTableBody
                    key={patternId}
                    pattern={pattern}
                    patternLen={trackConfig.patternLen}
                    toggleBeat={toggleBeat}
                    cellClassName={styles.cell}
                />
            </Table>
        </TableContainer>
    );
}
