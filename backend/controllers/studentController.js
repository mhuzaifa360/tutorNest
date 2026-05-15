import Student from "../models/studentModel.js";
import bcrypt from "bcryptjs";

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {

    // check existing student
    const existingStudent = await Student.findOne({
      where: { email: req.body.email },
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create student
    const student = await Student.create({
      ...req.body,
      email: req.body.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // remove password from response
    const { password, ...safeStudent } = student.toJSON();

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: safeStudent,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

// GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// GET SINGLE STUDENT
export const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 🔥 PASSWORD HASH LOGIC
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    await student.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message,
    });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.destroy();

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};