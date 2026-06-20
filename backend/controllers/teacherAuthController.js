import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/index.js";

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

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !mobile || !province || !city || !gender || !subjects || experience === undefined || !qualification || !teachingMode || hourlyFee === undefined || !cnic) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const profileImage = req.file ? req.file.filename : null;

    const existingTeacher = await Teacher.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists with this email",
      });
    }

    // Check CNIC uniqueness
    const existingCnic = await Teacher.findOne({
      where: { cnic: cnic.replace(/-/g, "") },
    });

    if (existingCnic) {
      return res.status(400).json({
        success: false,
        message: "A teacher already exists with this CNIC",
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

    // Strip dashes from CNIC for storage (store as 13 digits)
    const cleanCnic = cnic.replace(/-/g, "");

    const newTeacher = await Teacher.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      mobile,
      province,
      city,
      gender,
      subjects: parsedSubjects,
      experience: Number(experience) || 0,
      bio,
      profileImage,
      qualification,
      teachingMode,
      hourlyFee: Number(hourlyFee) || 0,
      cnic: cleanCnic,
    });

    const token = jwt.sign(
      {
        id: newTeacher.id,
        role: "teacher",
        firstName: newTeacher.firstName,
        lastName: newTeacher.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password from response
    const { password: _, ...safeUser } = newTeacher.toJSON();

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      token,
      user: {
        ...safeUser,
        role: "teacher",
      },
    });
  } catch (error) {
    console.error("Teacher Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.errors ? error.errors[0].message : "Teacher signup failed",
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const teacher = await Teacher.findOne({
      where: { email: email.trim().toLowerCase() },
    });

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
        role: "teacher",
        firstName: teacher.firstName,
        lastName: teacher.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Remove password from response
    const { password: _, ...safeUser } = teacher.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        ...safeUser,
        role: "teacher",
      },
    });
  } catch (error) {
    console.error("Teacher Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Teacher login failed",
      error: error.message,
    });
  }
};