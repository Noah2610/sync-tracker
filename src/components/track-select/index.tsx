import {
    createStyles,
    makeStyles,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@material-ui/core";
import { shallowEqual } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { actions, useDispatch, useSelector } from "../../store";
import NewTrack from "./new-track";
import EditTrack from "./edit-track";

const useStyles = makeStyles((_theme) =>
    createStyles({
        formControl: {
            minWidth: 256,
        },
    }),
);

export default function TrackSelect() {
    const [user] = useAuthState(auth);
    const styles = useStyles();
    const dispatch = useDispatch();
    const { selectedTrackId, tracks } = useSelector(
        (state) => ({
            selectedTrackId: state.track.selectedTrack?.id,
            tracks: state.track.tracks,
        }),
        (a, b) =>
            a.selectedTrackId === b.selectedTrackId &&
            shallowEqual(
                Object.values(a.tracks).map((track) => track.name),
                Object.values(b.tracks).map((track) => track.name),
            ),
    );

    if (!user) {
        return null;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gridGap={8}
        >
            <Box>
                <FormControl className={styles.formControl}>
                    <InputLabel id="select-track-label">Track</InputLabel>
                    <Select
                        value={selectedTrackId ?? ""}
                        variant="standard"
                        color="secondary"
                        labelId="select-track-label"
                        onChange={(event) =>
                            dispatch(
                                actions.track.selectTrack(
                                    event.target.value as string,
                                ),
                            )
                        }
                    >
                        {Object.keys(tracks).map((trackId) => (
                            <MenuItem key={trackId} value={trackId}>
                                {tracks[trackId]!.name || trackId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {selectedTrackId ? (
                <Box>
                    <EditTrack />
                </Box>
            ) : null}

            <Box>
                <NewTrack />
            </Box>
        </Box>
    );
}
