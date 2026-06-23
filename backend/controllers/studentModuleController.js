import SequelizePkg from "sequelize";
const { Op } = SequelizePkg;
import {
  Application,
  Course,
  Enrollment,
  Job,
  Message,
  Notification,
  Review,
  SavedTeacher,
  Teacher,
} from "../models/index.js";

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
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

export const getStudentOverview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const [enrolledCourses, savedTeachers, activeJobs, unreadMessages] =
      await Promise.all([
        Enrollment.count({ where: { studentId } }),
        SavedTeacher.count({ where: { studentId } }),
        Job.count({ where: { studentId, status: { [Op.ne]: "closed" } } }),
        Message.count({
          where: { receiverId: studentId, receiverRole: "student", isRead: false },
        }),
      ]);

    const [latestCourses, teachers, jobs, recentActivity] = await Promise.all([
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
      Job.findAll({ where: { studentId }, limit: 4, order: [["createdAt", "DESC"]] }),
      Notification.findAll({
        where: { userId: studentId },
        limit: 5,
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const jobIds = jobs.map((job) => job.id);
    const recentApplications = jobIds.length
      ? await Application.findAll({
          where: { jobId: jobIds },
          limit: 4,
          order: [["createdAt", "DESC"]],
          include: {
            model: Teacher,
            as: "tutor",
            attributes: ["id", "firstName", "lastName", "experience", "hourlyFee"],
          },
        })
      : [];

    const recommendedTeachers = await Promise.all(teachers.map(withTeacherRating));

    return res.status(200).json({
      success: true,
      data: {
        stats: { enrolledCourses, savedTeachers, activeJobs, unreadMessages },
        recentActivity,
        recommendedTeachers,
        latestCourses,
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

export const browseTeachers = async (req, res) => {
  try {
    const { search, subject, city, province, teachingMode } = req.query;
    const minFee = parseNumber(req.query.minFee);
    const maxFee = parseNumber(req.query.maxFee);
    const minExperience = parseNumber(req.query.minExperience);
    const minRating = parseNumber(req.query.minRating);
    const where = {};

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (province) where.province = province;
    if (teachingMode) where.teachingMode = teachingMode;
    if (minExperience !== null) where.experience = { [Op.gte]: minExperience };
    if (minFee !== null || maxFee !== null) {
      where.hourlyFee = {};
      if (minFee !== null) where.hourlyFee[Op.gte] = minFee;
      if (maxFee !== null) where.hourlyFee[Op.lte] = maxFee;
    }
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { qualification: { [Op.like]: `%${search}%` } },
      ];
    }

    const teachers = await Teacher.findAll({ where, order: [["createdAt", "DESC"]] });
    const withRatings = await Promise.all(teachers.map(withTeacherRating));
    const filtered = withRatings.filter((teacher) => {
      const subjectMatch = subject
        ? Array.isArray(teacher.subjects)
          ? teacher.subjects.includes(subject)
          : String(teacher.subjects || "").includes(subject)
        : true;
      const ratingMatch = minRating !== null ? teacher.rating >= minRating : true;
      return subjectMatch && ratingMatch;
    });

    return res.status(200).json({ success: true, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeacherDetail = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    const reviews = await Review.findAll({
      where: { teacherId: teacher.id },
      order: [["createdAt", "DESC"]],
    });
    const detail = await withTeacherRating(teacher);
    return res.status(200).json({ success: true, data: { ...detail, reviews } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const saveTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) {
      return res.status(400).json({ success: false, message: "teacherId is required" });
    }
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    const [saved, created] = await SavedTeacher.findOrCreate({
      where: { studentId: req.user.id, teacherId },
      defaults: { studentId: req.user.id, teacherId },
    });
    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Teacher saved" : "Teacher already saved",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedTeachers = async (req, res) => {
  try {
    const saved = await SavedTeacher.findAll({
      where: { studentId: req.user.id },
      include: { model: Teacher, as: "teacher" },
      order: [["createdAt", "DESC"]],
    });
    const teachers = await Promise.all(
      saved.filter((item) => item.teacher).map((item) => withTeacherRating(item.teacher))
    );
    return res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeSavedTeacher = async (req, res) => {
  try {
    const saved = await SavedTeacher.findOne({
      where: { studentId: req.user.id, teacherId: req.params.teacherId },
    });
    if (!saved) {
      return res.status(404).json({ success: false, message: "Saved teacher not found" });
    }
    await saved.destroy();
    return res.status(200).json({ success: true, message: "Teacher removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { studentId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobApplicationsForStudent = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { studentId: req.user.id } });
    const jobIds = jobs.map((job) => job.id);
    const applications = jobIds.length
      ? await Application.findAll({
          where: { jobId: jobIds },
          include: [
            {
              model: Teacher,
              as: "tutor",
              attributes: ["id", "firstName", "lastName", "experience", "hourlyFee", "qualification"],
            },
            { model: Job, as: "job", attributes: ["id", "title", "subject", "budget"] },
          ],
          order: [["createdAt", "DESC"]],
        })
      : [];
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const application = await Application.findByPk(req.params.id, {
      include: { model: Job, as: "job" },
    });
    if (!application || application.job?.studentId !== req.user.id) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    await application.update({ status });
    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, senderRole: req.user.role },
          { receiverId: req.user.id, receiverRole: req.user.role },
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    const grouped = new Map();
    messages.forEach((message) => {
      const other =
        message.senderId === req.user.id && message.senderRole === req.user.role
          ? `${message.receiverRole}-${message.receiverId}`
          : `${message.senderRole}-${message.senderId}`;
      if (!grouped.has(other)) grouped.set(other, message);
    });
    return res.status(200).json({
      success: true,
      data: Array.from(grouped.entries()).map(([key, lastMessage]) => ({ key, lastMessage })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { role, id } = req.params;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, senderRole: req.user.role, receiverId: id, receiverRole: role },
          { senderId: id, senderRole: role, receiverId: req.user.id, receiverRole: req.user.role },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverRole, body } = req.body;
    if (!receiverId || !receiverRole || !body?.trim()) {
      return res.status(400).json({
        success: false,
        message: "receiverId, receiverRole and body are required",
      });
    }
    const message = await Message.create({
      senderId: req.user.id,
      senderRole: req.user.role,
      receiverId,
      receiverRole,
      body: body.trim(),
    });
    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
