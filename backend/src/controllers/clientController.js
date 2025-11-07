// src/controllers/clientController.js
import Client from "../models/Client.js";
import ActivityLog from "../models/ActivityLog.js";
import { createClientSchema, updateClientSchema } from "../validations/clientSchema.js";
import { paginate } from "../utils/pagination.js";



export const createClient = async (req, res) => {
  // 1. Validate the whole payload (including the custom `id`)
  const parsed = createClientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, message: parsed.error.errors[0].message });
  }

  const { id, name, email } = parsed.data;

  // 2. ---- CHECK DUPLICATES ----
  // a) custom `id`
  const existingById = await Client.findOne({ id });
  if (existingById) {
    return res.status(409).json({
      success: false,
      message: "A client with this `id` already exists.",
    });
  }

  // b) name (case‑insensitive)
  const existingByName = await Client.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existingByName) {
    return res.status(409).json({
      success: false,
      message: "A client with this name already exists.",
    });
  }

  // c) email (if supplied)
  if (email) {
    const existingByEmail = await Client.findOne({ email });
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: "A client with this email already exists.",
      });
    }
  }

  // 3. ---- CREATE ----
  const client = await Client.create(parsed.data);

  // 4. ---- LOG ----
  await ActivityLog.create({
    user: req.user.id,
    entity: "Client",
    entityId: client._id,          // MongoDB `_id`
    action: "CREATE",
    changes: client.toObject(),
  });

  // 5. ---- RESPOND ----
  res.status(201).json({
    success: true,
    message: "Client created",
    data: client,
  });
};
export const getClients = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const result = await paginate(Client, query, +page, +limit);
  res.json({
    success: true,
    message: "Clients fetched",
    data: result.data,
    meta: result.meta,
  });
};

export const getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ success: false, message: "Client not found" });
  res.json({ success: true, data: client });
};

export const updateClient = async (req, res) => {
  const parsed = updateClientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, message: parsed.error.errors[0].message });
  }
  // ← NEW: Remove immutable fields from updates
  const { id, email, phone, ...allowedUpdates } = parsed.data;

  if (id || email || phone) {
    return res.status(400).json({
      success: false,
      message: "Cannot update `id`, `email`, or `phone`. These fields are immutable.",
    });
  }

const client = await Client.findOneAndUpdate(
    { _id: req.params.id }, // no deletedAt filter
    allowedUpdates,
    { new: true, runValidators: true }
  );

  if (!client) return res.status(404).json({ success: false, message: "Client not found" });

  await ActivityLog.create({
    user: req.user.id,
    entity: "Client",
    entityId: client._id,
    action: "UPDATE",
    changes: parsed.data,
  });

  res.json({ success: true, message: "Client updated", data: client });
};

export const deleteClient = async (req, res) => {
  console.log("req.params.id", req.params.id);
  const client = await Client.findOne({ _id: req.params.id });
  if (!client) return res.status(404).json({ success: false, message: "Client not found" });

  await client.softDelete(req.user.id);

  await ActivityLog.create({
    user: req.user.id,
    entity: "Client",
    entityId: client._id,
    action: "DELETE",
  });

  res.json({ success: true, message: "Client deleted (soft)" });
};