import SequelizePkg from "sequelize";
import { Application, Job, Student, Teacher } from "../models/index.js";
import { approvedTeacherWhere, publicTeacherAttributes } from "../utils/publicTeacher.js";

const { literal } = SequelizePkg;

const ok = (res, message, data = {}, status = 200, meta = undefined) =>
  res.status(status).json({ success: true, message, data, ...(meta ? { meta } : {}) });

const fail = (res, status, message, error = undefined) =>
  res.status(status).json({
    success: false,
    message,
    errors: error ? [error.message || String(error)] : [],
  });

const toPositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const normalizeJobPayload = (body) => {
  const title = body.title?.trim();
  const description = body.description?.trim();
  const subject = body.subject?.trim();
  const budget = Number(body.budget);

  return {
    title,
    description,
    subject,
    budget,
    city: body.city?.trim() || null,
    province: body.province?.trim() || null,
    classLevel: body.classLevel?.trim() || null,
    preferredGender: body.preferredGender?.trim() || null,
    mode: body.mode || body.teachingMode || "home",
  };
};

const validateJobPayload = (payload, partial = false) => {
  const errors = [];
  if (!partial || payload.title !== undefined) {
    if (!payload.title) errors.push("Title is required");
  }
  if (!partial || payload.description !== undefined) {
    if (!payload.description) errors.push("Description is required");
  }
  if (!partial || payload.subject !== undefined) {
    if (!payload.subject) errors.push("Subject is required");
  }
  if (!partial || payload.budget !== undefined) {
    if (!Number.isFinite(payload.budget) || payload.budget <= 0) errors.push("Budget must be a positive number");
  }
  if (payload.mode && !["online", "home", "both"].includes(payload.mode)) {
    errors.push("Teaching mode must be online, home, or both");
  }
  return errors;
};

const buildJobWhere = (req) => {
  const where = {};
  const role = req.user?.role;

  if (role === "teacher") {
    where.status = req.query.status || "open";
  } else if (role === "student" && (req.query.mine === "true" || req.query.owner === "me")) {
    where.studentId = req.user.id;
  } else if (req.query.status) {
    where.status = req.query.status;
  }

  if (req.query.subject) where.subject = { $like: `%${req.query.subject}%` };
  if (req.query.province) where.province = req.query.province;
  if (req.query.city) where.city = req.query.city;
  if (req.query.mode || req.query.teachingMode) where.mode = req.query.mode || req.query.teachingMode;
  if (req.query.classLevel) where.classLevel = req.query.classLevel;
  if (req.query.minBudget || req.query.maxBudget) {
    where.budget = {};
    if (req.query.minBudget) where.budget.$gte = Number(req.query.minBudget);
    if (req.query.maxBudget) where.budget.$lte = Number(req.query.maxBudget);
  }
  if (req.query.search) {
    const search = `%${req.query.search}%`;
    where.$or = [
      { title: { $like: search } },
      { subject: { $like: search } },
      { description: { $like: search } },
      { city: { $like: search } },
    ];
  }

  return where;
};

const jobInclude = [
  {
    model: Student,
    as: "student",
    attributes: ["id", "firstName", "lastName", "city", "province", "profileImage", "classLevel", "subjects"],
  },
  {
    model: Teacher,
    as: "assignedTeacher",
    where: approvedTeacherWhere(),
    attributes: publicTeacherAttributes,
    required: false,
  },
];

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return fail(res, 403, "Only students can post tuition jobs");
    }

    const payload = normalizeJobPayload(req.body);
    const errors = validateJobPayload(payload);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Invalid job data", errors });
    }

    const job = await Job.create({
      ...payload,
      studentId: req.user.id,
      status: "open",
    });

    const data = await Job.findById(job.id, { include: jobInclude });
    return ok(res, "Job created successfully", data, 201);
  } catch (error) {
    return fail(res, 500, "Error creating job", error);
  }
};

export const getJobs = async (req, res) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const limit = toPositiveInt(req.query.limit, 12, 50);
    const offset = (page - 1) * limit;
    const where = buildJobWhere(req);

    const result = await Job.findAndCountAll({
      where,
      include: jobInclude,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      attributes: {
        include: [
          [
            literal("(SELECT COUNT(*) FROM applications WHERE applications.jobId = Job.id)"),
            "applicationCount",
          ],
        ],
      },
    });

    return ok(res, "Jobs fetched successfully", result.rows, 200, {
      page,
      limit,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
    });
  } catch (error) {
    return fail(res, 500, "Error fetching jobs", error);
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id, {
      include: [
        ...jobInclude,
        {
          model: Application,
          as: "applications",
          attributes: ["id", "tutorId", "studentId", "status", "expectedFee", "createdAt"],
          include: [
            {
              model: Teacher,
              as: "tutor",
              where: approvedTeacherWhere(),
              attributes: publicTeacherAttributes,
              required: true,
            },
          ],
        },
      ],
      attributes: {
        include: [
          [
            literal("(SELECT COUNT(*) FROM applications WHERE applications.jobId = Job.id)"),
            "applicationCount",
          ],
        ],
      },
    });

    if (!job) return fail(res, 404, "Job not found");

    const isOwner = req.user.role === "student" && job.studentId === req.user.id;
    const isAssignedTeacher = req.user.role === "teacher" && job.assignedTeacherId === req.user.id;
    const canView = job.status === "open" || isOwner || isAssignedTeacher || req.user.role === "admin";
    if (!canView) return fail(res, 403, "You are not allowed to view this job");

    return ok(res, "Job fetched successfully", job);
  } catch (error) {
    return fail(res, 500, "Error fetching job", error);
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return fail(res, 404, "Job not found");

    if (req.user.role !== "admin" && job.studentId !== req.user.id) {
      return fail(res, 403, "Only the job owner can update this job");
    }

    const payload = normalizeJobPayload({ ...job.toJSON(), ...req.body });
    const errors = validateJobPayload(payload, true);
    if (errors.length) {
      return res.status(400).json({ success: false, message: "Invalid job data", errors });
    }

    const allowedStatus = ["open", "in-progress", "assigned", "closed"];
    const updates = {
      ...payload,
      status: allowedStatus.includes(req.body.status) ? req.body.status : job.status,
    };

    await job.update(updates);
    const data = await Job.findById(job.id, { include: jobInclude });
    return ok(res, "Job updated successfully", data);
  } catch (error) {
    return fail(res, 500, "Error updating job", error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return fail(res, 404, "Job not found");

    if (req.user.role !== "admin" && job.studentId !== req.user.id) {
      return fail(res, 403, "Only the job owner can delete this job");
    }

    await job.destroy();
    return ok(res, "Job deleted successfully", { id: Number(req.params.id) });
  } catch (error) {
    return fail(res, 500, "Error deleting job", error);
  }
};
