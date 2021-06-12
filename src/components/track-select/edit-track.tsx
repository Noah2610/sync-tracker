import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";
import useSelectedTrack from "../../hooks/use-selected-track";
import useBooleanState from "../../hooks/use-boolean-state";
import { Track } from "../../store/types";
import TrackModal from "../track-modal";

export default function EditTrack() {
    const [trackId, track] = useSelectedTrack();
    const firebaseDispatch = useFirebaseDispatch();
    const [isModalOpen, { on: openModal, off: closeModal }] =
        useBooleanState(false);

    if (!trackId || !track) {
        return null;
    }

    const updateTrack = (track: Track) => {
        closeModal();
        firebaseDispatch.setTrack({ id: trackId, doc: track });
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={openModal}>
                Edit
            </Button>
            <TrackModal
                track={track}
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={updateTrack}
            />
        </>
    );
}
