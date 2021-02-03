import * as z from "zod";

/**
 * Message for a client.
 * Sent from the server to a client.
 */
export type ClientMessage =
    /**
     * Connected.
     * Notifies that the client has successfully connected.
     */
    | {
          kind: "Connected";
          id: number;
      }
    /**
     * Message.
     * A chat message.
     */
    | {
          kind: "Message";
          clientId: number;
          content: string;
      };

const ClientMessageSchema: z.ZodSchema<ClientMessage> = z.union([
    z.object({
        kind: z.literal("Connected"),
        id: z.number(),
    }),
    z.object({
        kind: z.literal("Message"),
        clientId: z.number(),
        content: z.string(),
    }),
]);

/**
 * Attempts to parse the given message string as a client message.
 */
export function parseClientMessage(raw: any): ClientMessage | null {
    const json = JSON.parse(raw);
    const result = ClientMessageSchema.safeParse(json);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error);
        return null;
    }
}
