import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../../models/Student.js";

// SIGNUP
export const studentSignup = async (req, res) => {
  try {
    const { fullName, email, password, gradeLevel, subjects } = req.body;

    // check existing user
    const existingStudent = await Student.findOne({ where: { email } });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create student
    const student = await Student.create({
      fullName,
      email,
      password: hashedPassword,
      gradeLevel,
      subjects,
    });

    // create JWT token
    const token = jwt.sign(
      { id: student.id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Student created successfully",
      student,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};