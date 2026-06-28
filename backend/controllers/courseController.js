import { Course } from "../models/index.js";
import { Teacher } from "../models/index.js";
import { approvedTeacherWhere, publicTeacherAttributes } from "../utils/publicTeacher.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // teacher comes from JWT middleware
    const teacherId = req.user.id;
    const teacher = await Teacher.findOne({ where: approvedTeacherWhere({ id: teacherId }) });
    if (!teacher) {
      return res.status(403).json({
        success: false,
        message: "Only approved teachers can create courses",
      });
    }

    const course = await Course.create({
      title,
      description,
      price,
      teacherId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Teacher,
        as: "teacher",
        where: approvedTeacherWhere(),
        attributes: publicTeacherAttributes,
        required: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id, {
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
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // only teacher owner can update (optional but best)
    if (course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await course.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // only owner teacher can delete
    if (course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await course.destroy();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};
