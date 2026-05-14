import { Course } from "../models/index.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // teacher comes from JWT middleware
    const teacherId = req.user.id;

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

import { Course } from "../models/index.js";
import { Teacher } from "../models/index.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Teacher,
        as: "teacher",
        attributes: ["id", "firstName", "lastName", "email"],
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

    const course = await Course.findByPk(id, {
      include: {
        model: Teacher,
        as: "teacher",
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

