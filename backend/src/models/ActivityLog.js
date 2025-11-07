import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entity: { type: String, enum: ["User", "Client", "Project", "Task"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ["CREATE", "UPDATE", "DELETE", "RESTORE", "UPLOAD","GRANT_PERMISSION",   // ← Add this
      "REVOKE_PERMISSION"], required: true },
  changes: { type: mongoose.Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

activityLogSchema.index({ entity: 1, entityId: 1 });
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);