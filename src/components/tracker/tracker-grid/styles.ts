import {
    createStyles,
    withStyles,
    Table as MuiTable,
    TableBody as MuiTableBody,
    TableCell as MuiTableCell,
    TableContainer as MuiTableContainer,
    TableHead as MuiTableHead,
    TableRow as MuiTableRow,
} from "@material-ui/core";

export const Table = MuiTable;
export const TableContainer = MuiTableContainer;
export const TableHead = MuiTableHead;
export const TableBody = MuiTableBody;

export const TableCell = withStyles((theme) =>
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

export const HeadTableCell = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: "bold",
            backgroundColor: theme.tracker.colors.cells.note.main,
        },
    }),
)(TableCell);

export const NoteTableCell = withStyles((theme) =>
    createStyles({
        root: {
            fontWeight: "bold",
            backgroundColor: theme.tracker.colors.cells.note.main,
        },
    }),
)(TableCell);

export const BeatTableCell = withStyles((theme) => {
    const color =
        theme.tracker.colors.cells.border.alt ||
        theme.tracker.colors.cells.border.main;
    const activeColor = theme.tracker.colors.cells.active.main;
    return createStyles({
        root: ({ active }: { active: boolean }) => ({
            backgroundColor: active ? activeColor : "inherit",
            "&:hover": {
                cursor: "pointer",
                borderColor: color,
                boxShadow: `inset 0 0 4px 4px ${color}`,
            },
        }),
    });
})(TableCell);

export const TableRow = withStyles((theme) =>
    createStyles({
        root: {
            height: 16,
        },
    }),
)(MuiTableRow);

export const HeadTableRow = withStyles((theme) =>
    createStyles({
        root: {},
    }),
)(TableRow);

export const BeatTableRow = withStyles((theme) =>
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
