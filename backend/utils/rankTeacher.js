import { Teacher, Review } from "../models/index.js";
import { approvedTeacherWhere, publicTeacherAttributes, sanitizeTeacher } from "./publicTeacher.js";

// This file contains the logic to calculate a teacher's score based on various factors like ratings, experience, profile completeness, etc. It can be used in the search controller to rank teachers when fetching them for search results or listings.
export const calculateTeacherScore = (teacher, ratingData) => {
  let score = 0;

  // ⭐ rating weight (most important)
  score += (ratingData.averageRating || 0) * 4;

  // 🎓 experience weight
  score += (teacher.experience || 0) * 2;

  // 📦 profile completeness
  let completeness = 0;

  if (teacher.bio) completeness += 10;
  if (teacher.profileImage) completeness += 10;
  if (teacher.qualification) completeness += 10;
  if (teacher.subjects) completeness += 10;

  score += completeness;

  // 📝 review count boost
  score += (ratingData.totalReviews || 0) * 0.5;

  // ❌ penalty for low rating
  if (ratingData.averageRating < 2) {
    score -= 10;
  }

  return score;
};

// This function can be used in the controller to rank teachers based on their score
export const rankedTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      where: approvedTeacherWhere(),
      attributes: publicTeacherAttributes,
    });

    const ranked = await Promise.all(
      teachers.map(async (t) => {
        const reviews = await Review.findAll({
          where: { teacherId: t.id },
        });

        const totalReviews = reviews.length;

        const avgRating =
          totalReviews > 0
            ? reviews.reduce((a, b) => a + b.rating, 0) / totalReviews
            : 0;

        const score = calculateTeacherScore(t, {
          averageRating: avgRating,
          totalReviews,
        });

        return {
          ...sanitizeTeacher(t),
          rating: avgRating.toFixed(1),
          totalReviews,
          score,
        };
      })
    );

    // 🔥 SORT BY SCORE (MOST IMPORTANT STEP)
    ranked.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      data: ranked,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
