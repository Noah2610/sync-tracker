import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField,
} from "@material-ui/core";
import { Track } from "../store/types";

export interface DeleteTrackBoxProps {
    isOpen: boolean;
    onClose: () => void;
    track: Track;
    onSubmit: () => void;
}

export default function DeleteTrackBox({
    isOpen,
    onClose,
    track,
    onSubmit,
}: DeleteTrackBoxProps) {

    const handleSubmit = () => {
        console.log("yo");
        onSubmit();
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Permanently delete {track.name}?</DialogTitle>
            <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                >
                    yeet dat shit
                </Button>
        </Dialog>
    );
}