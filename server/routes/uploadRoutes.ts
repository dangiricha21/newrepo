import express from "express";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log("FILE 👉", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    url: req.file.path // 🔥 CLOUDINARY URL
  });
});

export default router;