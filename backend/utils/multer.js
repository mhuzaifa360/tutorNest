import multer from "multer";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || "uploads";

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.baseUrl.includes("student")) {
      cb(null, `${uploadDir}/students`);
    } else {
      cb(null, `${uploadDir}/tutors`);
    }
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
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpg, jpeg, png and webp files are allowed"
      )
    );
  }
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