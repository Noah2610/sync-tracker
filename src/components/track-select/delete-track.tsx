import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";
import useSelectedTrack from "../../hooks/use-selected-track";
import useBooleanState from "../../hooks/use-boolean-state";
import TrackModal from "../track-modal";
import DeleteTrackBox from "../delete-track-box";


export default function DeleteTrack() {
    const [trackId, track] = useSelectedTrack();
    const firebaseDispatch = useFirebaseDispatch();
    const [isModalOpen, { on: openModal, off: closeModal }] =
        useBooleanState(false);

    if (!trackId || !track) {
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
            <DeleteTrackBox
                track={track}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={deleteTrack}
            />
        </>
    );
}