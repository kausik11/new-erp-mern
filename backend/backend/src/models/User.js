import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import softDeletePlugin from "./softDelete.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
  permissions: {
    canCreateProject: { type: Boolean, default: false },
    canCreateTask: { type: Boolean, default: false },
  },
}, { timestamps: true });

// === HASH PASSWORD BEFORE SAVE ===
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// === COMPARE PASSWORD METHOD (CRITICAL FOR LOGIN) ===
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// Apply soft-delete
userSchema.plugin(softDeletePlugin);

// Hash password
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

export default mongoose.model("User", userSchema);