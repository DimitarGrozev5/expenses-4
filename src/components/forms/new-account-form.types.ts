import { z } from "zod";

export const NewAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initValue: z.number().gte(0, "Initial amount must be greater than 0"),
});

export type NewAccountFormData = z.infer<typeof NewAccountSchema>;
