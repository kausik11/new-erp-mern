// routes/upload.js
import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file" });

  res.json({
    success: true,
    message: "File uploaded",
    data: {
      url: req.file.path,
      public_id: req.file.filename,
    },
  });
});

export default router;