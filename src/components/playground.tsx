import { useEffect, useState } from "react";
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

    return <PlaygroundEnvelope />;

    return patternId !== undefined && pattern ? (
        <PlaygroundPattern patternId={patternId} pattern={pattern} />
    ) : null;
}

function PlaygroundEnvelope() {
    const [btn, setBtn] = useState(0);

    useEffect(() => {
        const env = new Tone.AmplitudeEnvelope();
        env.attack = 1.0;
        env.sustain = 1.0;
        env.release = 1.0;
        env.attackCurve = "exponential";
        env.releaseCurve = "exponential";
        // synth.connect(env).toDestination();

        // const channel = new Tone.Channel(1, -1).connect(
        //     new Tone.Distortion(1.0).toDestination(),
        // );

        const synth = new Tone.Synth({
            envelope: {
                attack: 0.2,
                sustain: 1.0,
                release: 0.5,
            },
        });
        const channel = new Tone.Channel(-8, -1);
        const vibrato = new Tone.Vibrato("C4", 1.0);
        const distortion = new Tone.Distortion(1.0);

        synth.set({
            envelope: {
                attack: 1.0,
                attackCurve: "linear",
            },
        });
        synth.chain(vibrato, distortion, channel);

        // synth.toDestination();
        // vibrato.toDestination();
        // distortion.toDestination();
        channel.toDestination();

        // channel.disconnect(Tone.Destination);

        // .connect(channel);

        // synth.disconnect(channel).toDestination();

        // const distortion = new Tone.Distortion(1.0);
        // const channel = new Tone.Channel(1, -1).toDestination();

        // distortion.connect(channel);

        // synth.connect(distortion);

        // .connect()
        // .chain(
        //     new Tone.Channel(1),
        //     Tone.Destination,
        // );

        console.log(synth.envelope);

        const start = Tone.now();

        // Tone.Transport.start(now, "0:0:0");

        // env.triggerAttackRelease("1n");

        synth.triggerAttackRelease("C2", "1n", start);
        // env.triggerAttackRelease("1n", start + 2);

        return () => {
            synth.dispose();

            // osc.dispose();
            // env.dispose();
            // Tone.Transport.stop();
        };
    }, [btn]);

    return <button onClick={() => setBtn((v) => ++v)}>PLAY</button>;
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
