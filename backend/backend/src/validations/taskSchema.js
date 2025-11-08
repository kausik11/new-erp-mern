import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Done"]).optional(),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();