import { useEffect, useState } from "react";
import Instrument from "../../lib/track/instrument";
import { Synth, SynthOptions, NoiseSynth, NoiseSynthOptions } from "tone";

export type ToneInstrument = Synth | NoiseSynth;

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
            switch (instrumentData.instrument) {
                case "Synth": {
                    setInstrument(
                        new Synth(instrumentData.options).toDestination(),
                    );
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
