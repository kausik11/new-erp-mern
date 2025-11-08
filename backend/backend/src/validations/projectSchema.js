import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
   client: z.string().min(3, "Client ID too short"),
startDate: z.coerce.date().optional(), // Accept "2025-12-01"
  endDate: z.coerce.date().optional(),
  status: z.enum(["Planning", "In Progress", "Completed", "On Hold"]).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();