import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route by fieldname when available
    const field = file.fieldname;
    if (field === "profileImage") {
      const dir = `${uploadDir}/profile`;
      ensureDir(dir);
      return cb(null, dir);
    }
    if (["cnicFront", "cnicBack", "degree", "certificate"].includes(field)) {
      const dir = `${uploadDir}/documents`;
      ensureDir(dir);
      return cb(null, dir);
    }

    // Fallbacks
    const category = req.uploadCategory;
    if (category === "profile") {
      const dir = `${uploadDir}/profile`;
      ensureDir(dir);
      return cb(null, dir);
    }

    if (category === "document") {
      const dir = `${uploadDir}/documents`;
      ensureDir(dir);
      return cb(null, dir);
    }

    if (req.user?.role === "student") {
      const dir = `${uploadDir}/students`;
      ensureDir(dir);
      return cb(null, dir);
    }

    if (req.user?.role === "teacher") {
      const dir = `${uploadDir}/tutors`;
      ensureDir(dir);
      return cb(null, dir);
    }

    if (req.baseUrl && req.baseUrl.includes("student")) {
      const dir = `${uploadDir}/students`;
      ensureDir(dir);
      return cb(null, dir);
    }

    const dir = `${uploadDir}/tutors`;
    ensureDir(dir);
    return cb(null, dir);
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
  const isDocumentUpload = req.uploadCategory === "document" || docFields.includes(file.fieldname);

  // Allow images for profile and images/pdf for documents
  if (isDocumentUpload) {
    const allowedDocExts = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
    const allowedDocMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedDocExts.includes(ext) && (mime.startsWith("image/") || allowedDocMimes.includes(mime))) {
      return cb(null, true);
    }
    return cb(new Error("Only jpg, jpeg, png, pdf, doc and docx files are allowed for documents"));
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

    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
      errors: [error.message || "File upload failed"],
    });
  });
};

export default upload;
