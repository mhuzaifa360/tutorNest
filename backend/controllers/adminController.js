import Admin from "../models/adminModel.js";
import { Teacher, Student, Job } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createNotification } from "./notificationController.js";

const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =======================
// CREATE ADMIN (optional)
// =======================
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ where: { email } });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: admin.id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      token,
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// =======================
// LOGIN ADMIN
// =======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin.id);

    return res.status(200).json({
      success: true,
      token,
      admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// =======================
// GET ADMIN PROFILE
// =======================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// =======================
// UPDATE ADMIN
// =======================
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await admin.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Admin updated",
      data: admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// =======================
// DELETE ADMIN
// =======================
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await admin.destroy();

    return res.status(200).json({
      success: true,
      message: "Admin deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ADMIN LOGIN (legacy - can be removed)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin.id);

    return res.status(200).json({
      success: true,
      token,
      admin,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await teacher.update({ status: "approved", rejectionReason: null });

    await createNotification({
      userId: teacher.id,
      title: "Teacher Profile Approved",
      message: "Your teacher profile has been approved. You can now apply for jobs and chat with students.",
      type: "system",
    });

    return res.status(200).json({
      success: true,
      message: "Teacher approved",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const rejectTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const rejectionReason = String(req.body?.rejectionReason || req.body?.reason || "").trim();
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
        errors: ["Rejection reason is required"],
      });
    }

    await teacher.update({ status: "rejected", rejectionReason });

    await createNotification({
      userId: teacher.id,
      title: "Teacher Profile Rejected",
      message: `Your teacher profile was rejected. Reason: ${rejectionReason}`,
      type: "system",
    });

    return res.status(200).json({
      success: true,
      message: "Teacher rejected",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const blockStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.destroy();

    return res.status(200).json({
      success: true,
      message: "Student removed (blocked)",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const students = await Student.count();
    const teachers = await Teacher.count();
    const jobs = await Job.count();

    return res.status(200).json({
      success: true,
      data: {
        students,
        teachers,
        jobs,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

