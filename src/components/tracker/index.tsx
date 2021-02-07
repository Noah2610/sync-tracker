import {
    createStyles,
    makeStyles,
    withStyles,
    Box,
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Track from "../../../lib/track";
import Pattern, { PatternId } from "../../../lib/track/pattern";
import useWs from "../../hooks/use-ws";
import Loading from "../loading";

const useStyles = makeStyles((theme) =>
    createStyles({
        noteCell: {
            backgroundColor: theme.tracker.colors.cells.note.main,
        },
        rowEven: {
            backgroundColor: theme.tracker.colors.cells.even.main,
        },
        rowOdd: {
            backgroundColor: theme.tracker.colors.cells.odd.main,
        },
    }),
);

const Table = withStyles((theme) => ({
    root: {
        color: theme.palette.text.primary,
        fontSize: 20,
        fontFamily: "Roboto Mono",
    },
}))(MuiTable);
const TableBody = MuiTableBody;
const TableCell = withStyles((theme) =>
    createStyles({
        root: {
            minWidth: 64,
            textAlign: "left",
            borderColor: theme.palette.secondary.main,
            borderWidth: 1,
            borderStyle: "solid",
        },
    }),
)(MuiTableCell);
const TableContainer = MuiTableContainer;
const TableHead = MuiTableHead;
const TableRow = withStyles((theme) =>
    createStyles({
        root: {},
    }),
)(MuiTableRow);

export default function Tracker() {
    const ws = useWs();
    const styles = useStyles();
    const [track, setTrack] = useState<Track | null>(null);
    const [
        selectedPatternId,
        setSelectedPatternId,
    ] = useState<PatternId | null>(null);

    useEffect(() => {
        if (ws) {
            ws.messages.on("UpdateTrack", ({ track }) => {
                setTrack(track);
                if (selectedPatternId === null) {
                    const pattern = track.patterns[0];
                    if (pattern) {
                        setSelectedPatternId(pattern.id);
                    }
                }
            });
        }
    }, []);

    if (!ws) {
        return <Loading />;
    }

    if (!track) {
        return (
            <>
                <Loading />
                Waiting for track data...
            </>
        );
    }

    const selectedPattern =
        selectedPatternId !== null
            ? track.patterns.find((pat) => pat.id === selectedPatternId)
            : undefined;

    console.log(track, selectedPatternId);

    return (
        <>
            {selectedPattern ? (
                <TableContainer>
                    <Table>
                        <TableBody>
                            {selectedPattern.notes.map((note, i) => (
                                <TableRow
                                    key={i}
                                    className={
                                        i % 2 === 0
                                            ? styles.rowEven
                                            : styles.rowOdd
                                    }
                                >
                                    <TableCell className={styles.noteCell}>
                                        {note.note}
                                    </TableCell>
                                    {new Array(track.config.patternLen)
                                        .fill(undefined)
                                        .map((_, step) => (
                                            <TableCell
                                                key={`${i}-${step}`}
                                            ></TableCell>
                                        ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>No pattern selected.</>
            )}
        </>
    );
}
