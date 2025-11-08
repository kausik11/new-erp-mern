// src/models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  entity: { type: String, required: true }, // "User", "Project", "Task", etc.
  entityId: { type: mongoose.Schema.Types.ObjectId },
  action: { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
  changes: { type: mongoose.Schema.Types.Mixed }, // old + new values
}, {
  timestamps: true,
});

export default mongoose.model("Activity", activitySchema);