import { SynthOptions, NoiseSynthOptions } from "tone";
import RecursivePartial from "../util/recursive-partial";
import * as z from "zod";

/**
 * An instrument config.
 * A wrapper for Tone.js instruments and their options.
 */
type Instrument =
    | {
          // https://tonejs.github.io/docs/14.7.77/Synth
          instrument: "Synth";
          options?: RecursivePartial<SynthOptions>;
      }
    | {
          // https://tonejs.github.io/docs/14.7.77/NoiseSynth
          instrument: "NoiseSynth";
          options?: RecursivePartial<NoiseSynthOptions>;
      };

export const InstrumentSchema: z.ZodSchema<Instrument> = z.union([
    z.object({
        instrument: z.literal("Synth"),
        options: z.any().optional(),
    }),
    z.object({
        instrument: z.literal("NoiseSynth"),
        options: z.any().optional(),
    }),
]);

export default Instrument;
