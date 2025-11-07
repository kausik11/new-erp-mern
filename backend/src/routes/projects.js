// src/routes/projects.js
import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addAttachment,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/auth.js";
import { checkPermission } from "../middleware/permission.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Public: List projects (with filters)
router.get("/", protect, getProjects);

// Protected
router.post(
  "/",
  protect,
  authorize("Admin", "Manager"),
  checkPermission("canCreateProject"),
  createProject
);

router.get("/:id", protect, getProjectById);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  updateProject
);

router.delete(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  deleteProject
);

// Upload attachment
router.post(
  "/:id/attachments",
  protect,
  upload.single("file"), // ← same!
  addAttachment
);

export default router;