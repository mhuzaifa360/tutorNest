import { Teacher, Review, Job, Course } from "../models/index.js";

// SEARCH & FILTER TEACHERS
export const searchTeachers = async (req, res) => {
  try {
    const {
      name,
      subject,
      city,
      teachingMode,
      minFee,
      maxFee,
      minExperience,
      minRating,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const offset = (page - 1) * limit;

    // WHERE CONDITIONS
    let whereCondition = {};

    if (name) {
      whereCondition.firstName = {
        $like: `%${name}%`,
      };
    }

    if (city) {
      whereCondition.city = city;
    }

    if (teachingMode) {
      whereCondition.teachingMode = teachingMode;
    }

    if (minExperience) {
      whereCondition.experience = {
        $gte: minExperience,
      };
    }

    if (minFee || maxFee) {
      whereCondition.hourlyFee = {
        ...(minFee && { $gte: Number(minFee) }),
        ...(maxFee && { $lte: Number(maxFee) }),
      };
    }

    // SORTING
    let order = [["createdAt", "DESC"]];

    if (sort === "fee_low") order = [["hourlyFee", "ASC"]];
    if (sort === "fee_high") order = [["hourlyFee", "DESC"]];
    if (sort === "experience") order = [["experience", "DESC"]];

    // FETCH TEACHERS
    const teachers = await Teacher.findAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order,
    });

    // ADD RATING (manual calc)
    const teachersWithRating = await Promise.all(
      teachers.map(async (teacher) => {
        const reviews = await Review.findAll({
          where: { teacherId: teacher.id },
        });

        const totalReviews = reviews.length;

        const avgRating =
          totalReviews > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;

        // rating filter
        if (minRating && avgRating < minRating) return null;

        return {
          ...teacher.toJSON(),
          rating: {
            average: Number(avgRating.toFixed(1)),
            totalReviews,
          },
        };
      })
    );

    const filtered = teachersWithRating.filter(Boolean);

    return res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total: filtered.length,
      data: filtered,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const {
      title,
      subject,
      city,
      mode,
      minBudget,
      maxBudget,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let where = {};

    if (title) {
      where.title = { $like: `%${title}%` };
    }

    if (subject) where.subject = subject;
    if (city) where.city = city;
    if (mode) where.mode = mode;
    if (status) where.status = status;

    if (minBudget || maxBudget) {
      where.budget = {
        ...(minBudget && { $gte: Number(minBudget) }),
        ...(maxBudget && { $lte: Number(maxBudget) }),
      };
    }

    const jobs = await Job.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      data: jobs,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const {
      title,
      teacherId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let where = {};

    if (title) {
      where.title = { $like: `%${title}%` };
    }

    if (teacherId) where.teacherId = teacherId;

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    const courses = await Course.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json({
      success: true,
      data: courses,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

