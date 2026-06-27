import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { Student } from '../models/index.js';

const badRequest = (res, message, errors = [message]) =>
  res.status(400).json({ success: false, message, errors });

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const parseList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [String(parsed).trim()].filter(Boolean);
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const uploadPath = (file, folder = "profile") =>
  file ? `/uploads/${folder}/${file.filename}` : null;

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

    const errors = [];
    if (!firstName?.trim()) errors.push("First name is required");
    if (!lastName?.trim()) errors.push("Last name is required");
    if (!email?.trim()) errors.push("Email is required");
    if (!password || password.length < 6) errors.push("Password must be at least 6 characters");
    if (!mobile?.trim()) errors.push("Mobile is required");
    if (!gender) errors.push("Gender is required");
    if (!province?.trim()) errors.push("Province is required");
    if (!city?.trim()) errors.push("City is required");
    if (!classLevel) errors.push("Class level is required");
    if (!req.file) errors.push("Profile image required");

    const parsedSubjects = parseList(subjects);
    if (!parsedSubjects.length) errors.push("Invalid subjects");

    if (errors.length) {
      return badRequest(res, errors[0], errors);
    }

    const profileImage = uploadPath(req.file);
    const normalizedEmail = normalizeEmail(email);

    const existingStudent = await Student.findOne({
      where: { email: normalizedEmail },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        errors: ["Email already exists"],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      mobile: mobile.trim(),
      province: province.trim(),
      city: city.trim(),
      gender,
      subjects: parsedSubjects,
      classLevel,
      otherSubject: req.body.otherSubject || null,
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

    // Build safe user object with required fields only
    const safeUser = newStudent.toJSON();
    const responseUser = {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: (safeUser.email || "").toString().trim().toLowerCase(),
      role: "student",
      profileImage: safeUser.profileImage || null,
    };

    return res.status(201).json({
      success: true,
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Student Signup Error:", error.message);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        errors: ["Email already exists"],
      });
    }

    if (error.name === "SequelizeValidationError") {
      const errors = error.errors?.map((item) => item.message) || [error.message];
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.errors ? error.errors[0].message : "Signup failed",
      errors: [error.message],
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

    const safeUser = student.toJSON();
    const responseUser = {
      id: safeUser.id,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      email: (safeUser.email || "").toString().trim().toLowerCase(),
      role: "student",
      profileImage: safeUser.profileImage || null,
    };

    return res.status(200).json({
      success: true,
      token,
      user: responseUser,
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
