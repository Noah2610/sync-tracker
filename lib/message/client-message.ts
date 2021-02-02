import z from "zod";

/**
 * Message for a client.
 * Sent from the server to a client.
 */
export type ClientMessage =
    | {
          /**
           * Notifies that the client has successfully connected.
           */
          Connected: {
              id: number;
          };
      }
    | {
          /**
           * A chat message.
           */
          Message: {
              userId: number;
              content: string;
          };
      };

const ClientMessageSchema: z.ZodSchema<ClientMessage> = z.union([
    z.object({
        Connected: z.object({
            id: z.number(),
        }),
    }),
    z.object({
        Message: z.object({
            userId: z.number(),
            content: z.string(),
        }),
    }),
]);

/**
 * Attempts to parse the given message string as a client message.
 */
export function parseClientMessage(raw: string): ClientMessage | null {
    const result = ClientMessageSchema.safeParse(raw);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error);
        return null;
    }
}
