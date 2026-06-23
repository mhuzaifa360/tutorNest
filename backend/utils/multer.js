import multer from "multer";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route by fieldname when available
    const field = file.fieldname;
    if (field === "profileImage") return cb(null, `${uploadDir}/profile`);
    if (["cnicFront", "cnicBack", "degree", "certificate"].includes(field)) return cb(null, `${uploadDir}/documents`);

    // Fallbacks
    const category = req.uploadCategory;
    if (category === "profile") {
      return cb(null, `${uploadDir}/profile`);
    }

    if (category === "document") {
      return cb(null, `${uploadDir}/documents`);
    }

    if (req.user?.role === "student") {
      return cb(null, `${uploadDir}/students`);
    }

    if (req.user?.role === "teacher") {
      return cb(null, `${uploadDir}/tutors`);
    }

    if (req.baseUrl && req.baseUrl.includes("student")) {
      return cb(null, `${uploadDir}/students`);
    }

    return cb(null, `${uploadDir}/tutors`);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {
  const docFields = ["cnicFront", "cnicBack", "degree", "certificate"];
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // Allow images for profile and images/pdf for documents
  if (docFields.includes(file.fieldname)) {
    if ([".jpg", ".jpeg", ".png", ".pdf"].includes(ext) && (mime.startsWith("image/") || mime === "application/pdf")) {
      return cb(null, true);
    }
    return cb(new Error("Only jpg, jpeg, png and pdf files are allowed for documents"));
  }

  // Default: accept common image types
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext) && mime.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new Error("Only jpg, jpeg, png and webp files are allowed"));
};

// MULTER INSTANCE
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;