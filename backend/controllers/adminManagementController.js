import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import {
  Application,
  Course,
  Job,
  Review,
  Student,
  Teacher,
} from "../models/index.js";

const safeRecord = (record, role) => {
  const plain = record.toJSON();
  const { password, ...safe } = plain;
  const name =
    role === "admin"
      ? safe.name
      : `${safe.firstName || ""} ${safe.lastName || ""}`.trim();
  const [firstName = name || "Admin", ...lastParts] = (name || "Admin").split(" ");

  return {
    ...safe,
    firstName: safe.firstName || firstName,
    lastName: safe.lastName || lastParts.join(" "),
    name,
    role,
    status: safe.status || "active",
  };
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin login requires admin role",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: "admin",
        firstName: admin.name?.split(" ")[0] || "Admin",
        lastName: admin.name?.split(" ").slice(1).join(" ") || "",
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: safeRecord(admin, "admin"),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

export const getAdminOverview = async (_req, res) => {
  try {
    const [
      admins,
      students,
      teachers,
      courses,
      jobs,
      applications,
      reviews,
      pendingTeachers,
    ] = await Promise.all([
      Admin.count(),
      Student.count(),
      Teacher.count(),
      Course.count(),
      Job.count(),
      Application.count(),
      Review.count(),
      Teacher.count({ where: { status: "pending" } }),
    ]);

    const totalUsers = admins + students + teachers;
    const growth = [
      students,
      Math.max(students + teachers - 2, 0),
      students + teachers,
      totalUsers,
    ];

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          admins,
          students,
          teachers,
          courses,
          jobs,
          applications,
          reviews,
          pendingTeachers,
        },
        charts: {
          userGrowth: growth,
          jobsPosted: [Math.max(jobs - 3, 0), Math.max(jobs - 1, 0), jobs],
          courseEnrollments: [
            Math.max(courses - 2, 0),
            Math.max(courses - 1, 0),
            courses,
          ],
        },
        notifications: [
          {
            id: "teacher-verification",
            title: "Teacher verification requests",
            message: `${pendingTeachers} teacher profiles are pending review`,
            type: "teacher",
          },
          {
            id: "jobs",
            title: "Jobs posted",
            message: `${jobs} jobs are available in the marketplace`,
            type: "job",
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading admin overview",
      error: error.message,
    });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const [admins, students, teachers] = await Promise.all([
      Admin.findAll(),
      Student.findAll(),
      Teacher.findAll(),
    ]);

    return res.status(200).json({
      success: true,
      data: [
        ...admins.map((item) => safeRecord(item, "admin")),
        ...students.map((item) => safeRecord(item, "student")),
        ...teachers.map((item) => safeRecord(item, "teacher")),
      ],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getAdminStudents = async (_req, res) => {
  try {
    const students = await Student.findAll();
    return res.status(200).json({
      success: true,
      data: students.map((item) => safeRecord(item, "student")),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminTeachers = async (_req, res) => {
  try {
    const teachers = await Teacher.findAll();
    return res.status(200).json({
      success: true,
      data: teachers.map((item) => safeRecord(item, "teacher")),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const setTeacherStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    await teacher.update({ status });
    return res.status(200).json({
      success: true,
      message: `Teacher ${status}`,
      data: safeRecord(teacher, "teacher"),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { role, id } = req.params;
    const Model = { admin: Admin, student: Student, teacher: Teacher }[role];

    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await Model.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminCourses = async (_req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Teacher,
        as: "teacher",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    });
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    await course.update(req.body);
    return res.status(200).json({ success: true, message: "Course updated", data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    await course.destroy();
    return res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminJobs = async (_req, res) => {
  try {
    const jobs = await Job.findAll();
    return res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    await job.update(req.body);
    return res.status(200).json({ success: true, message: "Job updated", data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    await job.destroy();
    return res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminApplications = async (_req, res) => {
  try {
    const applications = await Application.findAll();
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    await application.update({ status });
    return res.status(200).json({
      success: true,
      message: "Application updated",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReviews = async (_req, res) => {
  try {
    const reviews = await Review.findAll();
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    await review.destroy();
    return res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
