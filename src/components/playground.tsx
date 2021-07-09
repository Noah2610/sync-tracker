import { useEffect } from "react";
import * as Tone from "tone";
import usePatternNotes from "../hooks/use-pattern-notes";
import useSelectedPattern from "../hooks/use-selected-pattern";
import useSelectedPatternInstrument from "../hooks/use-selected-pattern-instrument";
import useInstrument from "../hooks/use-instrument";
import { BeatId, Instrument, NoteId, Pattern, PatternId } from "../store/types";
import safeObjectKeys from "../util/safeObjectKeys";

export default function Playground() {
    // const [, instrument] = useSelectedPatternInstrument();
    const [patternId, pattern] = useSelectedPattern();

    return patternId !== undefined && pattern ? (
        <PlaygroundPattern patternId={patternId} pattern={pattern} />
    ) : null;
}

function PlaygroundPattern({
    patternId,
    pattern,
}: {
    patternId: PatternId;
    pattern: Pattern;
}) {
    const instrument = useInstrument(pattern.instrument);
    const notes = usePatternNotes(patternId);

    useEffect(() => {
        if (!instrument || !notes) {
            return;
        }

        const start = Tone.now() + 1;
        const beatSpd = 0.25;

        const playedNotes: Set<NoteId> = new Set();

        const registeredNotes: [Tone.Unit.Time, NoteId][] = [];

        for (const noteId of safeObjectKeys(notes)) {
            const note = notes[noteId]!;
            for (const beatIdS of Object.keys(note.beats)) {
                const beatId = parseInt(beatIdS) as BeatId;
                const beat = note.beats[beatId]!;
                if (!beat.isActive) {
                    continue;
                }

                playedNotes.add(noteId);

                registeredNotes.push([`0:${beatId}:0`, noteId]);
            }
        }

        let part: Tone.Part;

        try {
            part = new Tone.Part((time, note) => {
                instrument.triggerAttackRelease(note, beatSpd, time);
            }, registeredNotes);
            part.start(0);
            Tone.Transport.start(start, "0:0:0");
        } catch (e) {
            console.error(e);
            return;
        }

        return () => {
            console.log("STOP");
            part.clear();
            part.stop();
            Tone.Transport.stop();
            // instrument.triggerRelease(Array.from(playedNotes));
        };
        // return () => instrument.triggerRelease(Array.from(playedNotes));
    }, [!!instrument, notes]);

    return null;
}
