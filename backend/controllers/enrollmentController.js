import { Enrollment, Course, Student } from '../models/index.js';

// ENROLL STUDENT IN COURSE
export const enrollStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT
    const { courseId } = req.body;

    // check if already enrolled
    const exists = await Enrollment.findOne({
      where: { studentId, courseId },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
      error: error.message,
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      include: {
        model: Course,
        as: "enrolledCourses",
        include: {
          association: "teacher",
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: student.enrolledCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};