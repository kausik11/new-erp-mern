// src/controllers/taskController.js
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { paginate } from "../utils/pagination.js";
import ActivityLog from "../models/ActivityLog.js";
import { createTaskSchema, updateTaskSchema } from "../validations/taskSchema.js";

export const createTask = async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  const task = await Task.create({
    ...parsed.data,
    project: projectId,
    assignedTo: parsed.data.assignedTo || null,
  });

  await ActivityLog.create({
    user: req.user.id,
    entity: "Task",
    entityId: task._id,
    action: "CREATE",
    changes: task.toObject(),
  });

  res.status(201).json({
    success: true,
    message: "Task created",
    data: task,
  });
};

export const getTasks = async (req, res) => {
  const { page = 1, limit = 10, status, assignedTo } = req.query;
  const projectId = req.params.projectId;

  const query = {
    project: projectId,
    ...(status && { status }),
    ...(assignedTo && { assignedTo }),
  };

  const result = await paginate(Task, query, +page, +limit, "assignedTo project");

  res.json({
    success: true,
    message: "Tasks fetched",
    data: result.data,
    meta: result.meta,
  });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate("project assignedTo");
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  res.json({ success: true, data: task });
};

export const updateTask = async (req, res) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

const task = await Task.findOneAndUpdate(
    { _id: req.params.id },
    parsed.data,
    { new: true, runValidators: true }
  ).populate("project assignedTo");

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  await ActivityLog.create({
    user: req.user.id,
    entity: "Task",
    entityId: task._id,
    action: "UPDATE",
    changes: parsed.data,
  });

  res.json({ success: true, message: "Task updated", data: task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  await task.softDelete(req.user.id);

  await ActivityLog.create({
    user: req.user.id,
    entity: "Task",
    entityId: task._id,
    action: "DELETE",
  });

  res.json({ success: true, message: "Task deleted (soft)" });
};