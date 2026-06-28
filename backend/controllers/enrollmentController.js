import { Enrollment, Course, Student, Teacher } from '../models/index.js';
import { createNotification } from "./notificationController.js";
import { approvedTeacherWhere, publicTeacherAttributes } from "../utils/publicTeacher.js";

// ENROLL STUDENT IN COURSE
export const enrollStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
        errors: ["courseId is required"],
      });
    }

    const course = await Course.findById(courseId, {
      include: {
        model: Teacher,
        as: "teacher",
        where: approvedTeacherWhere(),
        attributes: publicTeacherAttributes,
        required: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        errors: ["Invalid courseId"],
      });
    }

    // check if already enrolled
    const exists = await Enrollment.findOne({
      where: { studentId, courseId },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course",
        data: exists,
      });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    const student = await Student.findById(studentId);
    await createNotification({
      userId: studentId,
      userRole: "student",
      title: "Enrollment successful",
      message: `You enrolled in ${course.title}.`,
      type: "system",
    }).catch(() => null);

    if (course.teacherId) {
      const studentName =
        `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "A student";
      await createNotification({
        userId: course.teacherId,
        userRole: "teacher",
        title: "New student enrollment",
        message: `${studentName} enrolled in your ${course.title} course.`,
        type: "system",
      }).catch(() => null);
    }

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: {
        enrollment,
        course,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
      errors: [error.message],
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: Course,
          as: "course",
          include: {
            model: Teacher,
            as: "teacher",
            where: approvedTeacherWhere(),
            attributes: publicTeacherAttributes,
            required: true,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const courses = enrollments
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => ({
        ...enrollment.course.toJSON(),
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.createdAt,
        progress: enrollment.progress || 0,
      }));

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    try {
      const student = await Student.findById(req.user.id, {
        include: {
          model: Course,
          as: "enrolledCourses",
          include: {
            model: Teacher,
            as: "teacher",
            where: approvedTeacherWhere(),
            attributes: publicTeacherAttributes,
            required: true,
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: student?.enrolledCourses || [],
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Error fetching courses",
        errors: [error.message],
      });
    }
  }
};
