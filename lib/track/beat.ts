import * as z from "zod";

/**
 * For now, a beat is simply a positional step inside a pattern.
 * A pattern plays notes in order, from the first beat to the last.
 * The first beat in a pattern would be beat `0`.
 */
type Beat = number;

export const BeatSchema: z.ZodSchema<Beat> = z.number();

export default Beat;
