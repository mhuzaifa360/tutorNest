import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import Admin from "../models/adminModel.js";
import { FileRecord, Student, Teacher } from "../models/index.js";

const modelByRole = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
};

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

const findOwnerProfile = async (role, id) => {
  const Model = modelByRole[role];
  if (!Model) return null;
  return Model.findById(id);
};

export const getMyFiles = async (req, res) => {
  try {
    const files = await FileRecord.findAll({
      where: { ownerId: req.user.id, ownerRole: req.user.role },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      data: {
        files,
        profileImages: files.filter((file) => file.type === "profile"),
        documents: files.filter((file) => file.type === "document" || file.type === "verification"),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch files",
      errors: [error.message],
    });
  }
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

    const profile = await findOwnerProfile(req.user.role, req.user.id);
    if (profile?.constructor?.rawAttributes?.profileImage) {
      await profile.update({ profileImage: fileUrl });
    }

    return res.status(201).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: fileRecord,
      user: profile ? { ...profile.toJSON(), password: undefined } : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      errors: [error.message],
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
      errors: [error.message],
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

    if (
      req.user.role !== "admin" &&
      (fileRecord.ownerId !== req.user.id || fileRecord.ownerRole !== req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file",
      });
    }

    if (fileRecord.type === "profile") {
      const profile = await findOwnerProfile(fileRecord.ownerRole, fileRecord.ownerId);
      if (profile?.constructor?.rawAttributes?.profileImage && profile.profileImage === fileRecord.url) {
        await profile.update({ profileImage: null });
      }
    }

    const filePath = getFilePathFromUrl(fileRecord.url);
    await fsp.rm(filePath).catch(() => null);
    await fileRecord.destroy();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
      errors: [error.message],
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const fileRecord = await FileRecord.findById(req.params.id);
    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: "File record not found",
      });
    }

    const isOwner =
      fileRecord.ownerId === req.user.id && fileRecord.ownerRole === req.user.role;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this file",
      });
    }

    const filePath = getFilePathFromUrl(fileRecord.url);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on disk",
      });
    }

    res.setHeader("Content-Type", fileRecord.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(fileRecord.originalName)}"`
    );
    return fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to download file",
      errors: [error.message],
    });
  }
};
