import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { Student } from '../models/index.js';


// =========================
// SIGNUP CONTROLLER
// =========================
export const signupStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      province,
      city,
      classLevel,
      gender,
      subjects,
    } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    // check existing user
    const existingStudent = await Student.findOne({ where: { email: email.trim().toLowerCase() } });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create student
    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      province,
      city,
      gender,
      subjects,
      classLevel,
      profileImage,
    });

    // create JWT token
    const token = jwt.sign(
      {
        id: newStudent.id,
        role: "student"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      token,
      data: newStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

// =========================
// LOGIN CONTROLLER
// =========================
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ where: { email: email.trim().toLowerCase() } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        id: student.id,
        role: "student"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
