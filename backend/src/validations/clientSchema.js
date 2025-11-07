import { z } from "zod";

export const createClientSchema = z.object({
  id: z
    .string()
    .min(3, "ID must be at least 3 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "ID can only contain letters, numbers, _ and -"),
  name: z.string().min(2, "Name too short"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Lead"]).optional(),
});

export const updateClientSchema = createClientSchema.partial();