import Track from ".";
import { SharedMessageOfKind } from "../message";

/**
 * Updates the given track according to the given
 * "UpdateTrackBeat" `SharedMessage`.
 * Returns a new track, and the boolean `didUpdate` to indicate if
 * an update occured. Note, that the "new" track is a shallow copy
 * of the given track.
 */
export function updateTrackBeat(
    track: Track,
    message: SharedMessageOfKind<"UpdateTrackBeat">,
): { track: Track; didUpdate: boolean } {
    const newTrack = { ...track };
    let didUpdate = false;
    const { patternId, note, step, active } = message;
    const pattern = newTrack.patterns.find((pat) => pat.id === patternId);
    if (pattern) {
        const patternNote = pattern.notes.find((n) => n.note === note);
        if (patternNote) {
            const alreadyActive = patternNote.beats.includes(step);
            if (active && !alreadyActive) {
                patternNote.beats.push(step);
                didUpdate = true;
            } else if (!active && alreadyActive) {
                const idx = patternNote.beats.indexOf(step);
                if (idx !== -1) {
                    patternNote.beats.splice(idx, 1);
                }
                didUpdate = true;
            }
        } else {
            console.error(`Note ${note} in pattern ${patternId} not found.`);
        }
    } else {
        console.error(`Pattern with PatternId ${patternId} not found.`);
    }
    return { track: newTrack, didUpdate };
}
