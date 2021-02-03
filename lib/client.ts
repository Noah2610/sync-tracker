import * as z from "zod";

export default interface Client {
    id: number;
    name?: string;
}

export const ClientSchema: z.ZodSchema<Client> = z.object({
    id: z.number(),
    name: z.string().optional(),
});
