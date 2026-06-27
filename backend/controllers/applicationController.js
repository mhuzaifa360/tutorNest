import { sequelize } from "../config/database.js";
import { Application, Conversation, Job, Review, Student, Teacher } from "../models/index.js";
import { createNotification } from "./notificationController.js";

const ok = (res, message, data = {}, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, status, message, error = undefined) =>
  res.status(status).json({
    success: false,
    message,
    errors: error ? [error.message || String(error)] : [],
  });

const teacherAttributes = [
  "id",
  "firstName",
  "lastName",
  "qualification",
  "experience",
  "hourlyFee",
  "profileImage",
  "subjects",
  "city",
  "province",
];

const jobAttributes = [
  "id",
  "title",
  "subject",
  "classLevel",
  "budget",
  "city",
  "province",
  "mode",
  "status",
  "studentId",
  "assignedTeacherId",
  "createdAt",
];

const applicationInclude = [
  {
    model: Job,
    as: "job",
    attributes: jobAttributes,
    include: [
      {
        model: Student,
        as: "student",
        attributes: ["id", "firstName", "lastName", "profileImage", "city", "province"],
      },
    ],
  },
  {
    model: Teacher,
    as: "tutor",
    attributes: teacherAttributes,
  },
];

const attachTeacherRatings = async (applications) => {
  const rows = Array.isArray(applications) ? applications : [applications];
  return Promise.all(
    rows.map(async (application) => {
      const plain = application.toJSON ? application.toJSON() : application;
      if (!plain.tutor?.id) return plain;

      const reviews = await Review.findAll({ where: { teacherId: plain.tutor.id } });
      const average =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
          : 0;

      return {
        ...plain,
        tutor: {
          ...plain.tutor,
          rating: Number(average.toFixed(1)),
          reviewsCount: reviews.length,
        },
      };
    })
  );
};

const findApplicationForOwner = async (id, studentId) => {
  return Application.findOne({
    where: { id },
    include: [
      {
        model: Job,
        as: "job",
        where: { studentId },
        required: true,
      },
      {
        model: Teacher,
        as: "tutor",
        attributes: teacherAttributes,
      },
    ],
  });
};

export const applyJob = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return fail(res, 403, "Only teachers can apply for tuition jobs");
    }

    const tutorId = req.user.id;
    const jobId = Number(req.body.jobId);
    const coverLetter = (req.body.coverLetter || req.body.message || "").trim();
    const expectedFee = req.body.expectedFee === undefined ? null : Number(req.body.expectedFee);

    if (!jobId) return fail(res, 400, "jobId is required");
    if (!coverLetter) return fail(res, 400, "Cover letter is required");
    if (expectedFee !== null && (!Number.isFinite(expectedFee) || expectedFee <= 0)) {
      return fail(res, 400, "Expected fee must be a positive number");
    }

    const applyingTeacher = await Teacher.findById(tutorId);
    if (!applyingTeacher) return fail(res, 404, "Teacher not found");
    if (applyingTeacher.status !== "approved") {
      return fail(
        res,
        403,
        applyingTeacher.status === "rejected"
          ? applyingTeacher.rejectionReason || "Teacher account was rejected. Please upload updated documents."
          : "Teacher account is pending admin approval"
      );
    }

    const job = await Job.findById(jobId, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!job) return fail(res, 404, "Job not found");
    if (job.status !== "open") return fail(res, 400, "This job is no longer open for applications");

    const existing = await Application.findOne({ where: { jobId, tutorId } });
    if (existing) return fail(res, 409, "You already applied for this job");

    const application = await Application.create({
      jobId,
      tutorId,
      studentId: job.studentId,
      message: coverLetter,
      coverLetter,
      expectedFee,
      status: "pending",
    });

    const teacher = await Teacher.findById(tutorId, {
      attributes: ["id", "firstName", "lastName"],
    });
    const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}`.trim() : "A teacher";

    await createNotification({
      userId: job.studentId,
      title: "New Application",
      message: `${teacherName} applied for your ${job.subject} tuition job.`,
      type: "application",
    });

    const data = await Application.findById(application.id, { include: applicationInclude });
    const [withRating] = await attachTeacherRatings(data);
    return ok(res, "Application submitted successfully", withRating, 201);
  } catch (error) {
    return fail(res, 500, "Error applying for job", error);
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return fail(res, 403, "Only students can view applications on their jobs");
    }

    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          as: "job",
          attributes: jobAttributes,
          where: { studentId: req.user.id },
          required: true,
        },
        {
          model: Teacher,
          as: "tutor",
          attributes: teacherAttributes,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = await attachTeacherRatings(applications);
    return ok(res, "Student applications fetched successfully", data);
  } catch (error) {
    return fail(res, 500, "Error fetching student applications", error);
  }
};

export const getTeacherApplications = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return fail(res, 403, "Only teachers can view their applications");
    }

    const applications = await Application.findAll({
      where: { tutorId: req.user.id },
      include: applicationInclude,
      order: [["createdAt", "DESC"]],
    });

    const data = await attachTeacherRatings(applications);
    return ok(res, "Teacher applications fetched successfully", data);
  } catch (error) {
    return fail(res, 500, "Error fetching teacher applications", error);
  }
};

export const getApplications = async (req, res) => {
  if (req.user.role === "student") return getStudentApplications(req, res);
  if (req.user.role === "teacher") return getTeacherApplications(req, res);

  try {
    const applications = await Application.findAll({
      include: applicationInclude,
      order: [["createdAt", "DESC"]],
    });
    const data = await attachTeacherRatings(applications);
    return ok(res, "Applications fetched successfully", data);
  } catch (error) {
    return fail(res, 500, "Error fetching applications", error);
  }
};

export const getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id, { include: applicationInclude });
    if (!application) return fail(res, 404, "Application not found");

    const plain = application.toJSON();
    const canView =
      req.user.role === "admin" ||
      (req.user.role === "teacher" && plain.tutorId === req.user.id) ||
      (req.user.role === "student" && plain.job?.studentId === req.user.id);

    if (!canView) return fail(res, 403, "You are not allowed to view this application");

    const [data] = await attachTeacherRatings(application);
    return ok(res, "Application fetched successfully", data);
  } catch (error) {
    return fail(res, 500, "Error fetching application", error);
  }
};

export const acceptApplication = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (req.user.role !== "student") {
      await transaction.rollback();
      return fail(res, 403, "Only the job owner can accept applications");
    }

    const application = await findApplicationForOwner(req.params.id, req.user.id);
    if (!application) {
      await transaction.rollback();
      return fail(res, 404, "Application not found for your jobs");
    }

    if (application.status === "accepted") {
      await transaction.commit();
      const data = await Application.findById(application.id, { include: applicationInclude });
      return ok(res, "Application already accepted", data);
    }

    await application.update({ status: "accepted", studentId: req.user.id }, { transaction });
    await Job.update(
      { status: "assigned", assignedTeacherId: application.tutorId },
      { where: { id: application.jobId, studentId: req.user.id }, transaction }
    );
    await Application.update(
      { status: "rejected", studentId: req.user.id },
      {
        where: {
          jobId: application.jobId,
          id: { $ne: application.id },
          status: "pending",
        },
        transaction,
      }
    );

    const [conversation] = await Conversation.findOrCreate({
      where: { studentId: req.user.id, teacherId: application.tutorId },
      defaults: {
        lastMessage: "Application accepted. You can now chat.",
        lastMessageAt: new Date(),
      },
      transaction,
    });

    await transaction.commit();

    await createNotification({
      userId: application.tutorId,
      title: "Application Accepted",
      message: `Your application for ${application.job?.title || "a tuition job"} was accepted.`,
      type: "application",
    });

    const data = await Application.findById(application.id, { include: applicationInclude });
    const [withRating] = await attachTeacherRatings(data);
    return ok(res, "Application accepted and conversation created", {
      application: withRating,
      conversation,
    });
  } catch (error) {
    await transaction.rollback();
    return fail(res, 500, "Error accepting application", error);
  }
};

export const rejectApplication = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return fail(res, 403, "Only the job owner can reject applications");
    }

    const application = await findApplicationForOwner(req.params.id, req.user.id);
    if (!application) return fail(res, 404, "Application not found for your jobs");

    if (application.status === "accepted") {
      return fail(res, 400, "Accepted applications cannot be rejected");
    }

    await application.update({ status: "rejected", studentId: req.user.id });

    await createNotification({
      userId: application.tutorId,
      title: "Application Rejected",
      message: `Your application for ${application.job?.title || "a tuition job"} was rejected.`,
      type: "application",
    });

    const data = await Application.findById(application.id, { include: applicationInclude });
    const [withRating] = await attachTeacherRatings(data);
    return ok(res, "Application rejected successfully", withRating);
  } catch (error) {
    return fail(res, 500, "Error rejecting application", error);
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  if (status === "accepted") return acceptApplication(req, res);
  if (status === "rejected") return rejectApplication(req, res);
  return fail(res, 400, "Invalid status");
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id, { include: applicationInclude });
    if (!application) return fail(res, 404, "Application not found");

    const plain = application.toJSON();
    const canDelete =
      req.user.role === "admin" ||
      (req.user.role === "teacher" && plain.tutorId === req.user.id && plain.status === "pending") ||
      (req.user.role === "student" && plain.job?.studentId === req.user.id);

    if (!canDelete) return fail(res, 403, "You are not allowed to delete this application");

    await application.destroy();
    return ok(res, "Application deleted successfully", { id: Number(req.params.id) });
  } catch (error) {
    return fail(res, 500, "Error deleting application", error);
  }
};
