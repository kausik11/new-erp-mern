// src/controllers/projectController.js
import Project from "../models/Project.js";
import Client from "../models/Client.js";
import { paginate } from "../utils/pagination.js";
import ActivityLog from "../models/ActivityLog.js";
import { createProjectSchema, updateProjectSchema } from "../validations/projectSchema.js";

export const createProject = async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
   
  }
  const { name, client: clientId } = parsed.data;

  const client = await Client.findOne({ id: clientId });
  console.log("client", client);
  if (!client) return res.status(404).json({ success: false, message: "Client not found" });

  const project = await Project.create({
    ...parsed.data,
    client: client._id,
    manager: req.user.id,
  });

  await ActivityLog.create({
    user: req.user.id,
    entity: "Project",
    entityId: project._id,
    action: "CREATE",
    changes: project.toObject(),
  });

  res.status(201).json({
    success: true,
    message: "Project created",
    data: project,
  });
};

export const getProjects = async (req, res) => {
  const { page = 1, limit = 10, search = "", client, status } = req.query;

  const query = {
    ...(search && { name: { $regex: search, $options: "i" } }),
    // ...(client && { client }),
    ...(client && { "client.id": client }), 
    ...(status && { status }),
  };

  const result = await paginate(Project, query, +page, +limit, "client manager");

  res.json({
    success: true,
    message: "Projects fetched",
    data: result.data,
    meta: result.meta,
  });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("client manager tasks");
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  res.json({ success: true, data: project });
};

export const updateProject = async (req, res) => {
  const parsed = updateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const updates = { ...parsed.data };

  console.log("updates",updates)

  if (updates.client) {
    const client = await Client.findOne({ id: updates.client });

    console.log("client",client);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found with ID: " + updates.client,
      });
    }
    updates.client = client._id; // ← Use _id
  }
//Now update the project
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  await ActivityLog.create({
    user: req.user.id,
    entity: "Project",
    entityId: project._id,
    action: "UPDATE",
    changes: parsed.data,
  });

  res.json({ success: true, message: "Project updated", data: project });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  await project.softDelete(req.user.id);

  await ActivityLog.create({
    user: req.user.id,
    entity: "Project",
    entityId: project._id,
    action: "DELETE",
  });

  res.json({ success: true, message: "Project deleted (soft)" });
};

export const addAttachment = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  // Local file path
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  project.attachments.push({
    url: fileUrl,
    public_id: req.file.filename, // just filename
    uploadedBy: req.user.id,
  });

  await project.save();

  await ActivityLog.create({
    user: req.user.id,
    entity: "Project",
    entityId: project._id,
    action: "UPLOAD",
    changes: { file: req.file.filename },
  });

  res.json({
    success: true,
    message: "Attachment added (local)",
    data: project.attachments[project.attachments.length - 1],
  });
};