import * as z from "zod";

/**
 * Message for the server.
 * Sent from a client to the server.
 */
export type ServerMessage =
    | {
          /**
           * Message.
           * A message sent from a client.
           * Server should distribute it among all connected clients.
           */
          kind: "Message";
          content: string;
      }
    | {
          kind: "Undefined";
      };

const ServerMessageSchema: z.ZodSchema<ServerMessage> = z.union([
    z.object({
        kind: z.literal("Message"),
        content: z.string(),
    }),
    // TODO
    z.object({
        kind: z.literal("Undefined"),
    }),
]);

/**
 * Attempts to parse the given message string as a server message.
 */
export function parseServerMessage(raw: any): ServerMessage | null {
    const json = JSON.parse(raw);
    const result = ServerMessageSchema.safeParse(json);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error);
        return null;
    }
}
