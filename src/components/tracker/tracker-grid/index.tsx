import { createStyles, makeStyles } from "@material-ui/core";
import { useCallback, useEffect } from "react";
import Beat from "../../../../lib/track/beat";
import Note from "../../../../lib/track/note";
import Pattern from "../../../../lib/track/pattern";
import WsState from "../../../ws/ws-state";
import GridTableBody from "./grid-table-body";
import GridTableHead from "./grid-table-head";
import { Table, TableContainer } from "./styles";

import { useDispatch } from "../../../store";
import { actions } from "../../../store/track";

export interface TrackerGridProps {
    ws: WsState;
    pattern: Pattern;
    patternLen: number;
    barLen: number;
}

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

export default function TrackerGrid({
    ws,
    pattern,
    patternLen,
    barLen,
}: TrackerGridProps) {
    const styles = useStyles({ barLen });

    const dispatch = useDispatch();
    const toggleBeat = useCallback(
        ({ note, step, active }: { note: Note; step: Beat; active: boolean }) =>
            dispatch(
                actions.updateTrackBeat({
                    patternId: pattern.id,
                    note,
                    step,
                    active,
                }),
            ),
        [pattern.id],
    );

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

    return (
        <TableContainer>
            <Table>
                <GridTableHead
                    patternLen={patternLen}
                    cellClassName={styles.cell}
                />
                <GridTableBody
                    key={pattern.id}
                    pattern={pattern}
                    patternLen={patternLen}
                    toggleBeat={toggleBeat}
                    cellClassName={styles.cell}
                />
            </Table>
        </TableContainer>
    );
}
