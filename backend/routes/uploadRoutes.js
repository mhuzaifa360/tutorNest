import express from "express";
import upload, { handleUpload } from "../utils/multer.js";
import {
  getMyFiles,
  downloadFile,
  uploadProfileImage,
  uploadDocument,
  deleteFile,
} from "../controllers/uploadController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/files",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  getMyFiles
);

router.get(
  "/files/:id/download",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  downloadFile
);

router.post(
  "/profile-image",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  (req, res, next) => {
    req.uploadCategory = "profile";
    next();
  },
  handleUpload(upload.single("file")),
  uploadProfileImage
);

router.post(
  "/document",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  (req, res, next) => {
    req.uploadCategory = "document";
    next();
  },
  handleUpload(upload.single("file")),
  uploadDocument
);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  deleteFile
);

export default router;
