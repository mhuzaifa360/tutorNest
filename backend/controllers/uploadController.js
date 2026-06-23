import fs from "fs/promises";
import path from "path";
import { FileRecord } from "../models/index.js";

const getPublicUrl = (file) => {
  const filePath = path.join(file.destination, file.filename);
  const relativePath = path.relative(process.cwd(), filePath);
  return `/${relativePath.replace(/\\/g, "/")}`;
};

const getFilePathFromUrl = (url) => {
  const uploadDir = process.env.UPLOAD_DIR || "uploads";
  const relativePath = url.replace(/^\//, "").replace(/^uploads\//, "");
  return path.join(process.cwd(), uploadDir, relativePath);
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image file is required",
      });
    }

    const fileUrl = getPublicUrl(req.file);

    const fileRecord = await FileRecord.create({
      ownerId: req.user.id,
      ownerRole: req.user.role,
      type: "profile",
      entityId: req.body.entityId || null,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: fileRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      error: error.message,
    });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const fileUrl = getPublicUrl(req.file);

    const fileRecord = await FileRecord.create({
      ownerId: req.user.id,
      ownerRole: req.user.role,
      type: "document",
      entityId: req.body.entityId || null,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: fileRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const fileRecord = await FileRecord.findById(req.params.id);
    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File record not found",
      });
    }

    if (req.user.role !== "admin" && fileRecord.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file",
      });
    }

    const filePath = getFilePathFromUrl(fileRecord.url);
    await fs.rm(filePath).catch(() => null);
    await fileRecord.destroy();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
};
