import bcrypt from "bcryptjs";
import { FileRecord, Student, Teacher } from "../models/index.js";
import Admin from "../models/adminModel.js";

const modelByRole = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
};

const editableFieldsByRole = {
  student: [
    "firstName",
    "lastName",
    "mobile",
    "city",
    "province",
    "gender",
    "classLevel",
    "subjects",
  ],
  teacher: [
    "firstName",
    "lastName",
    "mobile",
    "city",
    "province",
    "gender",
    "qualification",
    "experience",
    "subjects",
    "hourlyFee",
    "bio",
  ],
  admin: ["name", "email"],
};

const getCurrentModel = (role) => modelByRole[role];

const parseList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : value;
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const sanitizeProfile = (record, role) => {
  const plain = record.toJSON();
  const { password, ...safeProfile } = plain;

  if (role === "admin") {
    const [firstName = safeProfile.name || "Admin", ...rest] = (
      safeProfile.name || "Admin"
    ).split(" ");

    return {
      ...safeProfile,
      firstName,
      lastName: rest.join(" "),
      role,
    };
  }

  return {
    ...safeProfile,
    role,
  };
};

const findCurrentProfile = async (req) => {
  const role = req.user?.role;
  const Model = getCurrentModel(role);

  if (!Model) return null;

  return Model.findById(req.user.id);
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await findCurrentProfile(req);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const safeProfile = sanitizeProfile(profile, req.user.role);
    const files = await FileRecord.findAll({
      where: { ownerId: req.user.id, ownerRole: req.user.role },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: { ...safeProfile, files },
      data: {
        user: { ...safeProfile, files },
        files,
        documents: files.filter((file) => file.type === "document" || file.type === "verification"),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const profile = await findCurrentProfile(req);
    const role = req.user?.role;

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const allowedFields = editableFieldsByRole[role] || [];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (role === "admin" && (req.body.firstName || req.body.lastName)) {
      updates.name = `${req.body.firstName || ""} ${req.body.lastName || ""}`.trim();
    }

    if (updates.subjects !== undefined) {
      updates.subjects = parseList(updates.subjects);
    }

    if (updates.experience !== undefined) {
      updates.experience = Number(updates.experience) || 0;
    }

    if (updates.hourlyFee !== undefined) {
      updates.hourlyFee = Number(updates.hourlyFee) || 0;
    }

    ["firstName", "lastName", "mobile", "city", "province", "qualification"].forEach(
      (field) => {
        if (typeof updates[field] === "string") {
          updates[field] = updates[field].trim();
        }
      }
    );

    await profile.update(updates);
    const safeProfile = sanitizeProfile(profile, role);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeProfile,
      data: { user: safeProfile },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const profile = await findCurrentProfile(req);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, profile.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await profile.update({ password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const profile = await findCurrentProfile(req);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    await profile.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};
