import express from "express";
import upload from "../utils/multer.js";
import {
  uploadProfileImage,
  uploadDocument,
  deleteFile,
} from "../controllers/uploadController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/profile-image",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  (req, res, next) => {
    req.uploadCategory = "profile";
    next();
  },
  upload.single("file"),
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
  upload.single("file"),
  uploadDocument
);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("student", "teacher", "admin"),
  deleteFile
);

export default router;
