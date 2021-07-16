import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";
import useSelectedTrack from "../../hooks/use-selected-track";
import useBooleanState from "../../hooks/use-boolean-state";
import DeleteTrackDialog from "../delete-track-dialog";

export default function DeleteTrack() {
    const [trackId, track] = useSelectedTrack();
    const firebaseDispatch = useFirebaseDispatch();
    const [isModalOpen, { on: openModal, off: closeModal }] =
        useBooleanState(false);

    if (trackId === undefined || !track) {
        return null;
    }

    const deleteTrack = () => {
        closeModal();
        firebaseDispatch.deleteTrack({ id: trackId });
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={openModal}>
                Delete Track
            </Button>
            <DeleteTrackDialog
                track={track}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={deleteTrack}
            />
        </>
    );
}
