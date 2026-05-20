import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/index.js"; // adjust path if needed

// =========================
// TEACHER SIGNUP
// =========================
export const signupTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      province,
      city,
      gender,
      subjects,
      experience,
      bio,
      qualification,
      teachingMode,
      hourlyFee,
      cnic,
    } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    // check if teacher already exists
    const existingTeacher = await Teacher.findOne({ where: { email } });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create teacher
    const newTeacher = await Teacher.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      province,
      city,
      gender,
      subjects,
      experience,
      bio,
      profileImage,
      qualification,
      teachingMode,
      hourlyFee,
      cnic,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: newTeacher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Teacher signup failed",
      error: error.message,
    });
  }
};

// =========================
// TEACHER LOGIN
// =========================
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ where: { email } });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: teacher.id,
        role: "teacher"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: teacher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Teacher login failed",
      error: error.message,
    });
  }
};