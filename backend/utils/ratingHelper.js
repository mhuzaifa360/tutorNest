import { Review } from "../models/index.js";

export const getTeacherRatingStats = async (teacherId) => {
  const reviews = await Review.findAll({
    where: { teacherId },
  });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  const sum = reviews.reduce((acc, item) => acc + item.rating, 0);

  const averageRating = sum / totalReviews;

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
  };
};