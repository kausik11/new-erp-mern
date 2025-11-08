// src/routes/tasks.js
import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/auth.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router({ mergeParams: true }); // Important for /projects/:projectId/tasks

router.get("/", protect, getTasks);

router.post(
  "/",
  protect,
  authorize("Admin", "Manager"),
  checkPermission("canCreateTask"),
  createTask
);

router.get("/:id", protect, getTaskById);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  updateTask
);

router.delete(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  deleteTask
);

export default router;