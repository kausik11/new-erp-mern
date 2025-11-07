import mongoose from "mongoose";
import softDeletePlugin from "./softDelete.js";

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String },
  address: { type: String },
  contactPerson: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Lead"], default: "Active" },
}, { timestamps: true });

clientSchema.plugin(softDeletePlugin);

export default mongoose.model("Client", clientSchema);