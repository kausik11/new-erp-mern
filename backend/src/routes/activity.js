// src/routes/activity.js
import express from "express";
import { protect } from "../middleware/auth.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const activities = await ActivityLog.find()
    

    console.log("Raw activities from DB:", activities); // ← DEBUG: Check terminal!

    const formatted = activities.map(act => {
      const actor = act.user?.name || "Someone";
      let actionText = "";
      let target = "";
      let details = "";

      // YOUR REAL ACTIONS ARE "UPDATE", "CREATE", etc. (uppercase!)
      const actionLower = act.action?.toLowerCase();

      if (actionLower === "create") {
        actionText = "created";
        target = `${act.entity || "Item"}`;
      } 
      else if (actionLower === "update") {
        actionText = "updated";

        if (act.entity === "User" && act.changes?.old && act.changes?.new) {
          const oldName = act.changes.old.name || "Unknown User";
          const newName = act.changes.new.name || oldName;
          target = `User: ${newName}`;

          const changed = [];

          // Role change
          if (act.changes.old.role !== act.changes.new.role) {
            changed.push(`role: ${act.changes.old.role} → ${act.changes.new.role}`);
          }

          // Name change
          if (act.changes.old.name !== act.changes.new.name) {
            changed.push(`name: ${act.changes.old.name} → ${act.changes.new.name}`);
          }

          // Permissions change (your format is flat object)
          if (act.changes.old.permissions && act.changes.new.permissions) {
            const oldPerms = Object.keys(act.changes.old.permissions)
              .filter(p => act.changes.old.permissions[p]);
            const newPerms = Object.keys(act.changes.new.permissions)
              .filter(p => act.changes.new.permissions[p]);

            if (JSON.stringify(oldPerms) !== JSON.stringify(newPerms)) {
              changed.push(`permissions updated`);
            }
          }

          if (changed.length > 0) {
            details = changed.join(" | ");
          }
        } else {
          target = `${act.entity || "Item"}`;
        }
      } 
      else if (actionLower === "delete") {
        actionText = "deleted";
        target = `${act.entity || "Item"}`;
      } else {
        actionText = act.action || "did something with";
        target = act.entity || "something";
      }

      return {
        _id: act._id,
        user: act.user,
        action: `${actor} ${actionText}`,
        target,
        details: details || undefined,
        createdAt: act.createdAt,
      };
    });

    console.log("Formatted activities:", formatted); // ← DEBUG: See final output

    res.json(formatted);
  } catch (err) {
    console.error("Activity log error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;