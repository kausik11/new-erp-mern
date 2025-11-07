// src/validations/userSchema.js
import { z } from "zod";

// Schema for creating a new user (Admin only)
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Manager", "Employee"]).optional().default("Employee"),
  permissions: z
    .object({
      canCreateProject: z.boolean().optional().default(false),
      canCreateTask: z.boolean().optional().default(false),
    })
    .optional(),
});

// Schema for updating an existing user
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["Admin", "Manager", "Employee"]).optional(),
  permissions: z
    .object({
      canCreateProject: z.boolean().optional(),
      canCreateTask: z.boolean().optional(),
    })
    .optional(),
});

// Optional: Schema for granting/revoking permissions
export const permissionSchema = z.object({
  permission: z.enum(["canCreateProject", "canCreateTask"]),
});