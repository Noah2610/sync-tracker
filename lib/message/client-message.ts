import * as z from "zod";
import Client, { ClientSchema } from "../client";
import Track, { TrackSchema } from "../track";
import SharedMessage, { SharedMessageShema } from "./shared-message";

/**
 * Message for a client.
 * Sent from the server to a client.
 */
type ClientMessage =
    /**
     * Connected.
     * Notifies that the client has successfully connected.
     */
    | {
          kind: "Connected";
          client: Client;
      }
    /**
     * Message.
     * A chat message.
     */
    | {
          kind: "Message";
          client: Client;
          content: string;
      }
    /**
     * UpdateClient.
     * Is sent when any client data changes.
     * Like when a client connects, disconnects, changes their name, etc.
     */
    | {
          kind: "UpdateClient";
          client: Client;
          disconnected?: boolean;
      }
    /**
     * UpdateTrack.
     * Sends the whole track config to the client.
     * Is sent once initially when a client loads a track.
     * Any further track updates should be smaller, separate client messages.
     */
    | {
          kind: "UpdateTrack";
          track: Track;
      }
    | SharedMessage;

export type ClientMessageOfKind<
    K extends ClientMessage["kind"]
> = ClientMessage & {
    kind: K;
};

const ClientMessageSchema: z.ZodSchema<ClientMessage> = z.union([
    z.object({
        kind: z.literal("Connected"),
        client: ClientSchema,
    }),
    z.object({
        kind: z.literal("Message"),
        client: ClientSchema,
        content: z.string(),
    }),
    z.object({
        kind: z.literal("UpdateClient"),
        client: ClientSchema,
        disconnected: z.boolean().optional(),
    }),
    z.object({
        kind: z.literal("UpdateTrack"),
        track: TrackSchema,
    }),
    SharedMessageShema,
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

export default ClientMessage;
