import {
    createStyles,
    makeStyles,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@material-ui/core";
import { shallowEqual } from "react-redux";
import { actions, useDispatch, useSelector } from "../../store";

const useStyles = makeStyles((_theme) =>
    createStyles({
        formControl: {
            minWidth: 256,
        },
    }),
);

export default function TrackSelect() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { selectedTrackId, trackIds } = useSelector(
        (state) => ({
            selectedTrackId: state.track.selectedTrackId,
            trackIds: state.track.trackIds,
        }),
        (a, b) =>
            a.selectedTrackId === b.selectedTrackId &&
            shallowEqual(a.trackIds, b.trackIds),
    );

    return (
        <FormControl className={styles.formControl}>
            <InputLabel id="select-track-label">Track</InputLabel>
            <Select
                value={selectedTrackId ?? ""}
                variant="standard"
                color="secondary"
                labelId="select-track-label"
                onChange={(event) =>
                    dispatch(
                        actions.track.selectTrack(event.target.value as string),
                    )
                }
            >
                {trackIds.map((trackId) => (
                    <MenuItem key={trackId} value={trackId}>
                        {trackId}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}