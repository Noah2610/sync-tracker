import * as z from "zod";

/**
 * Message for the server.
 * Sent from a client to the server.
 */
export type ServerMessage =
    | {
          /**
           * A message sent from a client.
           * Server should distribute it among all connected clients.
           */
          Message: {
              userId: number;
              content: string;
          };
      }
    // TODO
    | {};

const ServerMessageSchema: z.ZodSchema<ServerMessage> = z.union([
    z.object({
        Message: z.object({
            userId: z.number(),
            content: z.string(),
        }),
    }),
    // TODO
    z.object({}),
]);

/**
 * Attempts to parse the given message string as a server message.
 */
export function parseServerMessage(raw: any): ServerMessage | null {
    const result = ServerMessageSchema.safeParse(raw);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error);
        return null;
    }
}
