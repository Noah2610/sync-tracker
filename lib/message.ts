/**
 * Message for a client.
 * Sent from the server to a client.
 */
export type ClientMessage =
    | {
          Connected: {
              id: number;
          };
      }
    | {
          Echo: string;
      };

/**
 * Message for the server.
 * Sent from a client to the server.
 */
export enum ServerMessage {}
