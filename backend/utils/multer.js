import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
const documentFields = [
  "cnicFront",
  "cnicBack",
  "degree",
  "certificate",
  "degreeCertificate",
  "experienceCertificate",
];

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route by fieldname when available
    const field = file.fieldname;
    if (field === "profileImage") return cb(null, ensureDir(`${uploadDir}/profile`));
    if (documentFields.includes(field)) return cb(null, ensureDir(`${uploadDir}/documents`));

    // Fallbacks
    const category = req.uploadCategory;
    if (category === "profile") {
      return cb(null, ensureDir(`${uploadDir}/profile`));
    }

    if (category === "document") {
      return cb(null, ensureDir(`${uploadDir}/documents`));
    }

    if (req.user?.role === "student") {
      return cb(null, ensureDir(`${uploadDir}/students`));
    }

    if (req.user?.role === "teacher") {
      return cb(null, ensureDir(`${uploadDir}/tutors`));
    }

    if (req.baseUrl && req.baseUrl.includes("student")) {
      return cb(null, ensureDir(`${uploadDir}/students`));
    }

    return cb(null, ensureDir(`${uploadDir}/tutors`));
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
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // Allow images for profile and images/pdf for documents
  if (documentFields.includes(file.fieldname)) {
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

export const handleUpload = (middleware) => (req, res, next) => {
  middleware(req, res, (error) => {
    if (!error) return next();

    const message =
      error instanceof multer.MulterError
        ? error.message
        : error.message || "Invalid file";

    return res.status(400).json({
      success: false,
      message,
      errors: [message],
    });
  });
};

export default upload;
