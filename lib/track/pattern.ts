import * as z from "zod";
import Beat, { BeatSchema } from "./beat";
import Note, { NoteSchema } from "./note";

/**
 * A pattern is a collection of notes, which play in order.
 * After patterns are created, they can be arranged within
 * the track. The track will then play the patterns in the
 * arranged order.
 */
export default interface Pattern {
    id: PatternId;
    name: string;
    notes: PatternNote[];
}

export type PatternId = number;

/**
 * A patterns's note config.
 * Contains which note this is, and at which beats
 * this note is played within the pattern.
 */
export interface PatternNote {
    /** Which note this identifies. */
    note: Note;
    /**
     * All instances when this note plays in this pattern.
     * An array of beat numbers, when it plays.
     */
    beats: Beat[];
}

export const PatternIdSchema: z.ZodSchema<PatternId> = z.number();

export const PatternNoteSchema: z.ZodSchema<PatternNote> = z.object({
    note: NoteSchema,
    beats: z.array(BeatSchema),
});

export const PatternSchema: z.ZodSchema<Pattern> = z.object({
    id: PatternIdSchema,
    name: z.string(),
    notes: z.array(PatternNoteSchema),
});
