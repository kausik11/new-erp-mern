// src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";

import authRoutes from "./routes/auth.js";     // Correct path
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import clientRoutes from "./routes/clientRoutes.js";
import activityRoutes from "./routes/activity.js";

dotenv.config();
const app = express();

// Middleware
// app.use(cors());
// FIXED CORS FOR CREDENTIALS
app.use(cors({
  origin: "http://localhost:5173",  // Vite default port
  credentials: true,                // Allow cookies & Authorization headers
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/activities", activityRoutes);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
// ... other routes

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
      console.log("database connected")
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));