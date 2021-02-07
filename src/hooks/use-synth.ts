import { useEffect, useState } from "react";
import { Synth, SynthOptions } from "tone";
import { RecursivePartial } from "tone/Tone/core/util/Interface";

/**
 * Use a Tone.js Synth.
 */
export default function useSynth(
    synthOptions?: RecursivePartial<SynthOptions>,
): Synth | null {
    const [synth, setSynth] = useState<Synth | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSynth(new Synth(synthOptions).toDestination());
        }
    }, []);

    return synth;
}
