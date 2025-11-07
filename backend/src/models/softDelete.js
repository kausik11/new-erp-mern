// src/models/softDelete.js

import mongoose from "mongoose";
const softDeletePlugin = (schema) => {
  // Add soft-delete fields (if not already present)
  schema.add({
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  });

  // === FILTER OUT DELETED DOCS ===
  const excludedQueries = [/^find/, /^findOne/, /^findOneAndUpdate/, /^count/, /^aggregate/];

  excludedQueries.forEach((regex) => {
    schema.pre(regex, function (next) {
      // Only apply if not already filtered
      if (!this._conditions.deletedAt) {
        this.where({ deletedAt: null });
      }
      next();
    });
  });

  // === SOFT DELETE METHOD ===
  schema.methods.softDelete = async function (deletedByUserId) {
    this.deletedAt = new Date();
    this.deletedBy = deletedByUserId;
    return this.save();
  };

  // === RESTORE METHOD ===
  schema.methods.restore = async function () {
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  // === STATIC: Permanently remove (for Admin cleanup) ===
  schema.statics.permanentDelete = async function (query) {
    return this.deleteMany(query);
  };
};

export default softDeletePlugin;