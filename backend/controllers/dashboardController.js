import { Op } from "sequelize";
import Admin from "../models/adminModel.js";
import {
  Application,
  Course,
  Enrollment,
  Job,
  Message,
  Notification,
  Review,
  SavedTeacher,
  Student,
  Teacher,
} from "../models/index.js";

const assertSelfOrAdmin = (req, res, targetId) => {
  const id = Number(targetId);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid user id" });
    return false;
  }
  if (req.user.role !== "admin" && req.user.id !== id) {
    res.status(403).json({ success: false, message: "Access denied" });
    return false;
  }
  return true;
};

const withTeacherRating = async (teacher) => {
  const reviews = await Review.findAll({ where: { teacherId: teacher.id } });
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      : 0;
  const { password, ...safeTeacher } = teacher.toJSON();
  return {
    ...safeTeacher,
    rating: Number(rating.toFixed(1)),
    reviewsCount: reviews.length,
  };
};

export const getStudentDashboard = async (req, res) => {
  try {
    if (!assertSelfOrAdmin(req, res, req.params.id)) return;

    const studentId = Number(req.params.id);
    const [enrolledCourses, savedTeachers, activeJobs, unreadMessages, unreadNotifications] =
      await Promise.all([
        Enrollment.count({ where: { studentId } }),
        SavedTeacher.count({ where: { studentId } }),
        Job.count({ where: { studentId, status: { [Op.ne]: "closed" } } }),
        Message.count({
          where: { receiverId: studentId, receiverRole: "student", isRead: false },
        }),
        Notification.count({ where: { userId: studentId, isRead: false } }),
      ]);

    const [latestCourses, teachers, recentActivity, recentApplications] =
      await Promise.all([
        Course.findAll({
          limit: 4,
          order: [["createdAt", "DESC"]],
          include: {
            model: Teacher,
            as: "teacher",
            attributes: ["id", "firstName", "lastName"],
          },
        }),
        Teacher.findAll({ limit: 4, order: [["createdAt", "DESC"]] }),
        Notification.findAll({
          where: { userId: studentId },
          limit: 5,
          order: [["createdAt", "DESC"]],
        }),
        Application.findAll({
          limit: 4,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Job,
              as: "job",
              attributes: ["id", "title", "subject", "budget", "studentId"],
              where: { studentId },
              required: true,
            },
            {
              model: Teacher,
              as: "tutor",
              attributes: ["id", "firstName", "lastName", "experience", "hourlyFee"],
            },
          ],
        }),
      ]);

    const recommendedTeachers = await Promise.all(teachers.map(withTeacherRating));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          courses: enrolledCourses,
          enrolledCourses,
          savedTeachers,
          jobs: activeJobs,
          activeJobs,
          messages: unreadMessages,
          unreadMessages,
          notifications: unreadNotifications,
        },
        recentActivity,
        analytics: {
          enrolledCourses,
          savedTeachers,
          activeJobs,
        },
        recommendedTeachers,
        latestCourses,
        latestRecords: {
          courses: latestCourses,
          applications: recentApplications,
        },
        recentApplications,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading student dashboard",
      error: error.message,
    });
  }
};

export const getTeacherDashboard = async (req, res) => {
  try {
    if (!assertSelfOrAdmin(req, res, req.params.id)) return;

    const teacherId = Number(req.params.id);
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const [
      courses,
      applications,
      acceptedStudents,
      unreadMessages,
      unreadNotifications,
      reviews,
    ] = await Promise.all([
      Course.count({ where: { teacherId } }),
      Application.count({ where: { tutorId: teacherId } }),
      Application.count({ where: { tutorId: teacherId, status: "accepted" } }),
      Message.count({
        where: { receiverId: teacherId, receiverRole: "teacher", isRead: false },
      }),
      Notification.count({ where: { userId: teacherId, isRead: false } }),
      Review.findAll({
        where: { teacherId },
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: {
          model: Student,
          as: "student",
          attributes: ["id", "firstName", "lastName"],
        },
      }),
    ]);

    const allReviews = await Review.findAll({ where: { teacherId } });
    const averageRating =
      allReviews.length > 0
        ? Number(
            (
              allReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
              allReviews.length
            ).toFixed(1)
          )
        : 0;

    const estimatedEarnings = acceptedStudents * (teacher.hourlyFee || 0);

    const [recentApplications, recentActivity] = await Promise.all([
      Application.findAll({
        where: { tutorId: teacherId },
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Job,
            as: "job",
            attributes: ["id", "title", "subject", "budget"],
            include: {
              model: Student,
              as: "student",
              attributes: ["id", "firstName", "lastName"],
            },
          },
        ],
      }),
      Notification.findAll({
        where: { userId: teacherId },
        limit: 5,
        order: [["createdAt", "DESC"]],
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          courses,
          jobs: applications,
          applications,
          messages: unreadMessages,
          unreadMessages,
          notifications: unreadNotifications,
          students: acceptedStudents,
          earnings: estimatedEarnings,
          rating: averageRating,
        },
        recentActivity,
        analytics: {
          students: acceptedStudents,
          earnings: estimatedEarnings,
          rating: averageRating,
        },
        latestRecords: {
          applications: recentApplications,
          reviews,
        },
        recentApplications,
        recentReviews: reviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading teacher dashboard",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (_req, res) => {
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

    const latestTeachers = await Teacher.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "firstName", "lastName", "status", "createdAt"],
    });

    const latestApplications = await Application.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Job, as: "job", attributes: ["id", "title"] },
        { model: Teacher, as: "tutor", attributes: ["id", "firstName", "lastName"] },
      ],
    });

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
          messages: 0,
          notifications: pendingTeachers,
        },
        recentActivity: [
          {
            id: "teacher-verification",
            title: "Teacher verification requests",
            message: `${pendingTeachers} teacher profiles are pending review`,
            type: "admin",
          },
          {
            id: "jobs",
            title: "Jobs posted",
            message: `${jobs} jobs are available in the marketplace`,
            type: "job",
          },
        ],
        analytics: {
          userGrowth: growth,
          jobsPosted: [Math.max(jobs - 3, 0), Math.max(jobs - 1, 0), jobs],
          courseEnrollments: [
            Math.max(courses - 2, 0),
            Math.max(courses - 1, 0),
            courses,
          ],
        },
        latestRecords: {
          teachers: latestTeachers,
          applications: latestApplications,
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
            type: "admin",
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading admin dashboard",
      error: error.message,
    });
  }
};
