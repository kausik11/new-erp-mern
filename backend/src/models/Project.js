import mongoose from "mongoose";
import softDeletePlugin from "./softDelete.js";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["Planning", "In Progress", "Completed", "On Hold"], default: "Planning" },
  attachments: [{
    url: String,
    public_id: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

projectSchema.plugin(softDeletePlugin);

export default mongoose.model("Project", projectSchema);