import * as z from "zod";
import Note, { NoteSchema } from "../track/note";
import { PatternId, PatternIdSchema } from "../track/pattern";

/**
 * Messages sent to both the client and the server.
 */
type SharedMessage =
    /**
     * UpdateTrackBeat.
     * Updates the active state of a specific beat in a track's pattern.
     */
    | {
          kind: "UpdateTrackBeat";
          patternId: PatternId;
          note: Note;
          step: number;
          active: boolean;
      }
    // TODO
    | {
          kind: "Undefined";
      };

export const SharedMessageShema: z.ZodSchema<SharedMessage> = z.union([
    z.object({
        kind: z.literal("UpdateTrackBeat"),
        patternId: PatternIdSchema,
        note: NoteSchema,
        step: z.number(),
        active: z.boolean(),
    }),
    // TODO
    z.object({
        kind: z.literal("Undefined"),
    }),
]);

export default SharedMessage;
