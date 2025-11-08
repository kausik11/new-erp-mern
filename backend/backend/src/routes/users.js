// src/routes/users.js
import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  grantPermission,
  revokePermission,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";
import { checkPermission } from "../middleware/permission.js";

const router = express.Router();

// ====== NEW: GET CURRENT USER (/api/users/me) ======
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Admin-only: Create user
router.post(
  "/",
  protect,
  authorize("Admin"),
  createUser
);

// Admin/Manager: List users with search & pagination
router.get(
  "/",
  protect,
  authorize("Admin", "Manager"),
  getUsers
);

// Anyone with permission: View own or others (Admin/Manager)
router.get(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  getUserById
);

// Admin: Update any user
router.put(
  "/:id",
  protect,
  authorize("Admin"),
  updateUser
);

// Admin: Soft-delete user
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteUser
);

// Admin/Manager: Grant permission to Employee
router.patch(
  "/:id/grant",
  protect,
  authorize("Admin", "Manager"),
  grantPermission
);

// Admin/Manager: Revoke permission
router.patch(
  "/:id/revoke",
  protect,
  authorize("Admin", "Manager"),
  revokePermission
);

export default router;