// src/routes/clientRoutes.js
import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin", "Manager"), createClient)
  .get(protect, getClients);

router
  .route("/:id")
  .get(protect, getClientById)
  .put(protect, authorize("Admin", "Manager"), updateClient)
  .delete(protect, authorize("Admin", "Manager"), deleteClient);

export default router;