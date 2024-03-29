import { useState } from "react";
import { Button } from "@material-ui/core";
import useFirebaseDispatch from "../../firebase/use-firebase-dispatch";
import { useDispatch, actions } from "../../store";
import { Track } from "../../store/types";
import useBooleanState from "../../hooks/use-boolean-state";
import TrackModal from "../track-modal";

export default function NewTrack() {
    const dispatch = useDispatch();
    const firebaseDispatch = useFirebaseDispatch();
    const [isModalOpen, { on: openModal, off: closeModal }] =
        useBooleanState(false);

    const newTrack = (track: Track) => {
        closeModal();
        firebaseDispatch
            .newTrack({ doc: track })
            .then((trackDoc) =>
                dispatch(actions.track.selectTrack(trackDoc.id)),
            );
    };

    return (
        <>
            <Button variant="contained" color="secondary" onClick={openModal}>
                New Track
            </Button>
            <TrackModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={newTrack}
            />
        </>
    );
}
