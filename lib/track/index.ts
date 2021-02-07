import * as z from "zod";
import Pattern, { PatternId, PatternIdSchema, PatternSchema } from "./pattern";

/**
 * All data for a track to be editable and playable.
 */
export default interface Track {
    name: string;
    config: TrackConfig;
    patternArrangement: PatternId[];
    patterns: Pattern[];
}

/**
 * Config data for track. Stuff like BPM.
 */
export interface TrackConfig {
    bpm: number;
    /** Number of beats in a pattern. */
    patternLen: number;
    /** Number of beats in a bar. */
    barLen: number;
}

const TrackConfigSchema: z.ZodSchema<TrackConfig> = z.object({
    bpm: z.number().int().positive(),
    patternLen: z.number().int().positive(),
    barLen: z.number().int().positive(),
});

const TrackSchema: z.ZodSchema<Track> = z.object({
    name: z.string(),
    config: TrackConfigSchema,
    patternArrangement: z.array(PatternIdSchema),
    patterns: z.array(PatternSchema),
});

/**
 * Attempts to parse the given track data string as a `Track` type.
 */
export function parseTrack(raw: any): Track | null {
    const json = JSON.parse(raw);
    const result = TrackSchema.safeParse(json);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error);
        return null;
    }
}
