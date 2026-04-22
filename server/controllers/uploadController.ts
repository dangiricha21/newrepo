import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
};