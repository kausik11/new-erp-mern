import mongoose from "mongoose";
import softDeletePlugin from "./softDelete.js";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["To Do", "In Progress", "Review", "Done"], default: "To Do" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  dueDate: Date,
  attachments: [{
    url: String,
    public_id: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

taskSchema.plugin(softDeletePlugin);

export default mongoose.model("Task", taskSchema);