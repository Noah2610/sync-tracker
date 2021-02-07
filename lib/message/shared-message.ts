import * as z from "zod";
import Note, { NoteSchema } from "../track/note";
import { PatternId, PatternIdSchema } from "../track/pattern";

/**
 * Messages sent to both the client and the server.
 */
type SharedMessage =
    /**
     * UpdateTrackPart Beat.
     * Updates a part of the track.
     */
    | {
          kind: "UpdateTrackPart";
          part: "Beat";
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
        kind: z.literal("UpdateTrackPart"),
        part: z.literal("Beat"),
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
