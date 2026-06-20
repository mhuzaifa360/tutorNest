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

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !mobile || !province || !city || !classLevel || !gender || !subjects) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for student signup",
      });
    }

    const profileImage = req.file ? req.file.filename : null;

    const existingStudent = await Student.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse subjects if it's a string
    let parsedSubjects = subjects;
    if (typeof subjects === "string") {
      try {
        parsedSubjects = JSON.parse(subjects);
      } catch {
        parsedSubjects = subjects.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    // Parse classLevel if it's a string
    let parsedClassLevel = classLevel;
    if (typeof classLevel === "string") {
      try {
        parsedClassLevel = JSON.parse(classLevel);
      } catch {
        parsedClassLevel = classLevel;
      }
    }

    const newStudent = await Student.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      mobile,
      province,
      city,
      gender,
      subjects: parsedSubjects,
      classLevel: parsedClassLevel,
      profileImage,
    });

    const token = jwt.sign(
      {
        id: newStudent.id,
        role: "student",
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password from response
    const { password: _, ...safeUser } = newStudent.toJSON();

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      token,
      user: {
        ...safeUser,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Student Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.errors ? error.errors[0].message : "Signup failed",
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

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
        role: "student",
        firstName: student.firstName,
        lastName: student.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password from response
    const { password: _, ...safeUser } = student.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        ...safeUser,
        role: "student",
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
