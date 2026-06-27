import { Teacher } from "../models/index.js";
import bcrypt from "bcryptjs";
import { getTeacherRatingStats } from "../utils/ratingHelper.js";

const firstFile = (files, ...keys) => {
  for (const key of keys) {
    if (files?.[key]?.[0]) return files[key][0];
  }
  return null;
};

const uploadPath = (file, folder) =>
  file ? `/uploads/${folder}/${file.filename}` : null;

const parseSubjects = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return value;
  try {
    return JSON.parse(value);
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const safeTeacher = (teacher) => {
  const { password, ...safe } = teacher.toJSON();
  return safe;
};

// CREATE TEACHER
export const createTeacher = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email || !req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        errors: ["Email and password are required"],
      });
    }

    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        errors: ["Email already exists"],
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const teacher = await Teacher.create({
      ...req.body,
      email,
      password: hashedPassword,
      subjects: parseSubjects(req.body.subjects),
      status: req.body.status || "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: safeTeacher(teacher),
    });
  } catch (error) {
    const status = error.name === "SequelizeValidationError" ? 400 : 500;
    const errors = error.errors?.map((item) => item.message) || [error.message];
    return res.status(status).json({
      success: false,
      message: status === 400 ? errors[0] : "Error creating teacher",
      errors,
    });
  }
};

// GET ALL TEACHERS
export const getTeachers = async (_req, res) => {
  try {
    const teachers = await Teacher.findAll();

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers.map(safeTeacher),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      errors: [error.message],
    });
  }
};

// GET SINGLE TEACHER
export const getSingleTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const rating = await getTeacherRatingStats(teacher.id);

    return res.status(200).json({
      success: true,
      data: {
        ...safeTeacher(teacher),
        rating,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      errors: [error.message],
    });
  }
};

// UPDATE TEACHER
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (req.user.role !== "admin" && teacher.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own teacher profile",
      });
    }

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.subjects !== undefined) {
      updates.subjects = parseSubjects(updates.subjects);
    }

    delete updates.email;
    delete updates.cnic;

    if (updates.experience !== undefined) updates.experience = Number(updates.experience);
    if (updates.hourlyFee !== undefined) updates.hourlyFee = Number(updates.hourlyFee);

    const files = req.files || {};
    const profileImageFile = firstFile(files, "profileImage");
    const cnicFrontFile = firstFile(files, "cnicFront");
    const cnicBackFile = firstFile(files, "cnicBack");
    const degreeFile = firstFile(files, "degreeCertificate", "degree");
    const experienceFile = firstFile(files, "experienceCertificate", "certificate");
    const uploadedVerificationDocs = Boolean(cnicFrontFile || cnicBackFile || degreeFile || experienceFile);

    if (profileImageFile) updates.profileImage = uploadPath(profileImageFile, "profile");
    if (cnicFrontFile) updates.cnicFront = uploadPath(cnicFrontFile, "documents");
    if (cnicBackFile) updates.cnicBack = uploadPath(cnicBackFile, "documents");
    if (degreeFile) updates.degreeCertificate = uploadPath(degreeFile, "documents");
    if (experienceFile) updates.experienceCertificate = uploadPath(experienceFile, "documents");

    if (uploadedVerificationDocs && teacher.status === "rejected") {
      updates.status = "pending";
      updates.rejectionReason = null;
    }

    await teacher.update(updates);

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: safeTeacher(teacher),
    });
  } catch (error) {
    const status = error.name === "SequelizeValidationError" ? 400 : 500;
    const errors = error.errors?.map((item) => item.message) || [error.message];
    return res.status(status).json({
      success: false,
      message: status === 400 ? errors[0] : "Error updating teacher",
      errors,
    });
  }
};

// DELETE TEACHER
export const deleteTeachers = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (req.user.role !== "admin" && teacher.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own teacher profile",
      });
    }

    await teacher.destroy();

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting teacher",
      errors: [error.message],
    });
  }
};
