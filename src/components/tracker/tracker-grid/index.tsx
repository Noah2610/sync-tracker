import { useCallback, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core";
import { actions, useDispatch, useSelector, State } from "../../../store";
import { Pattern, Beat, Note } from "../../../store/types/pattern";
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
    patternId: state.track.selectedTrackId,
    pattern: state.track.selectedPatternId
        ? state.track.patterns[state.track.selectedPatternId]
        : undefined,
});

type SelectorReturn = ReturnType<typeof selector>;

const selectorEqual = (a: SelectorReturn, b: SelectorReturn) =>
    a.patternId === b.patternId &&
    // shallowEqual(Object.keys(a.pattern.notes), Object.keys(b.pattern.notes)) && // TODO
    shallowEqual(a.trackConfig, b.trackConfig);

export default function TrackerGrid() {
    const { trackConfig, patternId, pattern } = useSelector(
        selector,
        selectorEqual,
    );

    const styles = useStyles({ barLen: trackConfig?.barLen ?? 4 });

    const toggleBeat = ({
        note,
        step,
        active,
    }: {
        note: Note;
        step: Beat;
        active: boolean;
    }) => console.log(`Toggle beat: ${note} at ${step} to ${active}`);

    // const toggleBeat = useCallback(
    //     ({ note, step, active }: { note: Note; step: Beat; active: boolean }) =>
    //         ws.sendMessage({
    //             kind: "UpdateTrackBeat",
    //             patternId: pattern.id,
    //             note,
    //             step,
    //             active,
    //         }),
    //     [pattern.id],
    // );

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
