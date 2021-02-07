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
import Pattern from "../../../lib/track/pattern";

export interface TrackerGridProps {
    pattern: Pattern;
    patternLen: number;
}

const Table = MuiTable;
const TableContainer = MuiTableContainer;
const TableHead = MuiTableHead;
const TableBody = MuiTableBody;

const TableCell = withStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.primary,
            fontSize: 18,
            fontFamily: "Roboto Mono",
            width: 64,
            height: 16,
            padding: 4,
            textAlign: "left",
            borderColor: theme.tracker.colors.cells.border.main,
            borderWidth: 1,
            borderStyle: "solid",
            boxSizing: "border-box",
        },
    }),
)(MuiTableCell);

const HeadTableCell = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: "bold",
            backgroundColor: theme.tracker.colors.cells.note.main,
        },
    }),
)(TableCell);

const NoteTableCell = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: "bold",
            backgroundColor: theme.tracker.colors.cells.note.main,
        },
    }),
)(TableCell);

const BeatTableCell = withStyles((theme) => {
    const color =
        theme.tracker.colors.cells.border.alt ||
        theme.tracker.colors.cells.border.main;
    return createStyles({
        root: {
            "&:hover": {
                cursor: "pointer",
                borderColor: color,
                boxShadow: `inset 0 0 4px 4px ${color}`,
            },
        },
    });
})(TableCell);

const TableRow = withStyles((theme) =>
    createStyles({
        root: {
            height: 16,
        },
    }),
)(MuiTableRow);

const HeadTableRow = withStyles((theme) =>
    createStyles({
        root: {},
    }),
)(TableRow);

const BeatTableRow = withStyles((theme) =>
    createStyles({
        root: {
            "&:nth-child(even)": {
                backgroundColor: theme.tracker.colors.cells.even.main,
            },
            "&:nth-child(odd)": {
                backgroundColor: theme.tracker.colors.cells.odd.main,
            },
        },
    }),
)(TableRow);

export default function TrackerGrid({ pattern, patternLen }: TrackerGridProps) {
    const patternLenArr = new Array(patternLen).fill(undefined);
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
                            {patternLenArr.map((_, step) => (
                                <BeatTableCell
                                    key={`${i}-${step}`}
                                ></BeatTableCell>
                            ))}
                        </BeatTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
