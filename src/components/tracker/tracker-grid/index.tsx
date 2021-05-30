import { createStyles, makeStyles } from "@material-ui/core";
import { useCallback, useEffect } from "react";
import Beat from "../../../../lib/track/beat";
import Note from "../../../../lib/track/note";
import Pattern from "../../../../lib/track/pattern";
import GridTableBody from "./grid-table-body";
import GridTableHead from "./grid-table-head";
import { Table, TableContainer } from "./styles";

export interface TrackerGridProps {
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
    pattern,
    patternLen,
    barLen,
}: TrackerGridProps) {
    const styles = useStyles({ barLen });

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
