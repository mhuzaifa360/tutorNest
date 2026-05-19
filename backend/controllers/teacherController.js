import { Teacher } from "../models/index.js";
import bcrypt from "bcryptjs";
import { getTeacherRatingStats } from "../utils/ratingHelper.js";

// CREATE TEACHER
export const createTeacher = async (req, res) => {
  try {

    // check existing teacher
    const existingTeacher = await Teacher.findOne({
      where: { email: req.body.email },
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    }
    // console.log(res.body);
    
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create teacher
    const teacher = await Teacher.create({
      ...req.body,
      email: req.body.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // remove password from response
    const { password, ...safeTeacher } = teacher.toJSON();

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: safeTeacher,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating teacher",
      error: error.message,
    });
  }
};

// GET ALL TEACHERS
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();

    return res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: error.message,
    });
  }
};

// GET SINGLE TEACHER
export const getSingleTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // ⭐ rating calculate
    const rating = await getTeacherRatingStats(teacher.id);

    return res.status(200).json({
      success: true,
      data: {
        ...teacher.toJSON(),
        rating,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teacher",
      error: error.message,
    });
  }
};

// UPDATE TEACHER
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // 🔥 PASSWORD HASH LOGIC
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    await teacher.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating teacher",
      error: error.message,
    });
  }
};

// DELETE TEACHER
export const deleteTeachers = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
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
      error: error.message,
    });
  }
};
