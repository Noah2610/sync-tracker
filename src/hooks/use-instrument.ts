import { useEffect, useState } from "react";
import Instrument from "../../lib/track/instrument";
import {
    Synth,
    SynthOptions,
    NoiseSynth,
    NoiseSynthOptions,
    PolySynth,
} from "tone";

export type ToneInstrument = Synth | PolySynth | NoiseSynth;

// type InstrumentOfType<I extends Instrument["instrument"]> = Instrument & {
//     instrument: I;
// };

// type ToneInstruments = {
//     Synth: Synth;
//     NoiseSynth: NoiseSynth;
// };

// type ToneInstrumentOfType<
//     I extends Instrument["instrument"]
// > = ToneInstruments[I];

/**
 * Use a Tone.js instrument.
 */
export default function useInstrument(
    instrumentData: Instrument,
): ToneInstrument | null {
    const [instrument, setInstrument] = useState<ToneInstrument | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            switch (instrumentData.name) {
                case "Synth": {
                    const instr = instrumentData.isPoly
                        ? new PolySynth(Synth, instrumentData.options)
                        : new Synth(instrumentData.options);
                    setInstrument(instr.toDestination());
                    break;
                }
                case "NoiseSynth": {
                    setInstrument(
                        new NoiseSynth(instrumentData.options).toDestination(),
                    );
                    break;
                }
                default: {
                    console.error("Unknown instrument", instrument);
                }
            }

            return () => instrument?.dispose();
        }

        return () => {};
    }, []);

    return instrument;
}
