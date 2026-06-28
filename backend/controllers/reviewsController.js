import { Review, Student, Teacher } from "../models/index.js";
import { createNotification } from "./notificationController.js";
import { approvedTeacherWhere } from "../utils/publicTeacher.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const studentId = req.user.id;

    const {
      teacherId,
      rating,
      comment,
    } = req.body;

    const numericRating = Number(rating);
    if (!teacherId || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "teacherId and rating from 1 to 5 are required",
      });
    }

    const teacher = await Teacher.findOne({ where: approvedTeacherWhere({ id: teacherId }) });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // CREATE REVIEW
    const review = await Review.create({
      studentId,
      teacherId,
      rating: numericRating,
      comment: comment?.trim() || "",
    });

    // 🔔 CREATE NOTIFICATION FOR TEACHER
    await createNotification({
      userId: teacherId,
      userRole: "teacher",
      title: "New Review",
      message: "You received a new review",
      type: "review",
      metadata: {
        reviewId: review.id,
        studentId,
        teacherId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// GET ALL REVIEWS
export const getReviews = async (req, res) => {
  try {
    const options = {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: Teacher,
          as: "teacher",
          where: approvedTeacherWhere(),
          attributes: ["id", "firstName", "lastName", "profileImage"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    };
    const limit = Number(req.query.limit);
    if (limit > 0) options.limit = limit;

    const reviews = await Review.findAll(options);

    return res.status(200).json({
      success: true,
      data: reviews,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// GET SINGLE REVIEW
export const getSingleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching review",
      error: error.message,
    });
  }
};

// UPDATE REVIEW
export const updateReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    await review.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
