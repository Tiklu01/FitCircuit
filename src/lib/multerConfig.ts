import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// ✅ Explicitly type the params to avoid TypeScript errors
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file): Promise<{ folder: string; format: string }> => ({
    folder: "food_analysis", // ✅ Cloudinary folder
    format: file.mimetype.split("/")[1], // ✅ Get format from mimetype
  }),
});

const upload = multer({ storage });

export default upload;
