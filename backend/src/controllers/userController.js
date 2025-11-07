// src/controllers/userController.js
import User from "../models/User.js";
import { paginate } from "../utils/pagination.js";
import ActivityLog from "../models/ActivityLog.js";
import { createUserSchema, updateUserSchema } from "../validations/userSchema.js";

// CREATE USER (Admin only)
export const createUser = async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const { email } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  const user = await User.create(parsed.data);

  await ActivityLog.create({
    user: req.user.id,
    entity: "User",
    entityId: user._id,
    action: "CREATE",
    changes: user.toObject(),
  });

  res.status(201).json({
    success: true,
    message: "User created",
    data: user,
  });
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "", role } = req.query;

  const query = {
    ...(search && { name: { $regex: search, $options: "i" } }),
    ...(role && { role }),
  };

  const result = await paginate(User, query, +page, +limit);

  res.json({
    success: true,
    message: "Users fetched",
    data: result.data,
    meta: result.meta,
  });
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({
    success: true,
    data: user,
  });
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const oldUser = await User.findById(req.params.id);
  if (!oldUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    parsed.data,
    { new: true, runValidators: true }
  );

  await ActivityLog.create({
    user: req.user.id,
    entity: "User",
    entityId: updatedUser._id,
    action: "UPDATE",
    changes: { old: oldUser.toObject(), new: updatedUser.toObject() },
  });

  res.json({
    success: true,
    message: "User updated",
    data: updatedUser,
  });
};

// SOFT DELETE
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  await user.softDelete(req.user.id);

  await ActivityLog.create({
    user: req.user.id,
    entity: "User",
    entityId: user._id,
    action: "DELETE",
  });

  res.json({
    success: true,
    message: "User deleted (soft)",
  });
};

// GRANT PERMISSION
//this endpoint works on Employee only
export const grantPermission = async (req, res) => {
  const { permission } = req.body; // "canCreateProject" or "canCreateTask"
  if (!["canCreateProject", "canCreateTask"].includes(permission)) {
    return res.status(400).json({ success: false, message: "Invalid permission" });
  }

 
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "Employee") {
    return res.status(400).json({ success: false, message: "Invalid user" });
  }

  user.permissions[permission] = true;
  await user.save();

  await ActivityLog.create({
    user: req.user.id,
    entity: "User",
    entityId: user._id,
    action: "GRANT_PERMISSION",
    changes: { permission, granted: true },
  });

  res.json({
    success: true,
    message: "Permission granted",
    data: user,
  });
};

// REVOKE PERMISSION
export const revokePermission = async (req, res) => {
  const { permission } = req.body;
  if (!["canCreateProject", "canCreateTask"].includes(permission)) {
    return res.status(400).json({ success: false, message: "Invalid permission" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.permissions[permission] = false;
  await user.save();

  await ActivityLog.create({
    user: req.user.id,
    entity: "User",
    entityId: user._id,
    action: "REVOKE_PERMISSION",
    changes: { permission, revoked: true },
  });

  res.json({
    success: true,
    message: "Permission revoked",
    data: user,
  });
};