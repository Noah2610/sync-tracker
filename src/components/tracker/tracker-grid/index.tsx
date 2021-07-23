import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core";
import { useSelector, State } from "../../../store";
import useFirebaseDispatch from "../../../firebase/use-firebase-dispatch";
import GridTableBody from "./grid-table-body";
import GridTableHead from "./grid-table-head";
import { Table, TableContainer } from "./styles";
import useSelectedTrack from "../../../hooks/use-selected-track";
import useSelectedPattern from "../../../hooks/use-selected-pattern";

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

export default function TrackerGrid() {
    const [trackId, track] = useSelectedTrack();
    const [patternId, pattern] = useSelectedPattern();
    const trackConfig = track?.config;

    const styles = useStyles({ barLen: trackConfig?.barLen ?? 4 });

    const firebaseDispatch = useFirebaseDispatch();

    const toggleBeat = (...args: any[]) =>
        console.log(`Toggle beat! ${args.join(", ")}`);

    // const toggleBeat = useCallback( // {{{
    //     ({
    //         note,
    //         beat,
    //         isActive,
    //     }: {
    //         note: NoteId;
    //         beat: BeatId;
    //         isActive: boolean;
    //     }) => {
    //         if (trackId !== undefined && patternId !== undefined) {
    //             firebaseDispatch
    //                 .setBeat({
    //                     id: beat,
    //                     trackId,
    //                     patternId,
    //                     noteId: note,
    //                     doc: {
    //                         isActive,
    //                     },
    //                 })
    //                 .catch(console.error);
    //         } else {
    //             console.error(
    //                 "Can't update firebase beat because trackId or patternId aren't set",
    //             );
    //         }
    //     },
    //     [trackId, patternId],
    // ); // }}}

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
