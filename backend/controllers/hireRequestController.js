import { HireRequest, Student, Teacher } from "../models/index.js";
import { createNotification } from "./notificationController.js";
import { approvedTeacherWhere } from "../utils/publicTeacher.js";

export const createHireRequest = async (req, res) => {
  try {
    const { teacherId, message } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "teacherId is required",
        errors: ["teacherId is required"],
      });
    }

    const teacher = await Teacher.findOne({ where: approvedTeacherWhere({ id: teacherId }) });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
        errors: ["Invalid teacherId"],
      });
    }

    const existing = await HireRequest.findOne({
      where: {
        studentId: req.user.id,
        teacherId,
        status: "pending",
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A pending hire request already exists for this teacher",
        data: existing,
      });
    }

    const request = await HireRequest.create({
      studentId: req.user.id,
      teacherId,
      message: message?.trim() || "",
      status: "pending",
    });

    const student = await Student.findById(req.user.id);
    const studentName =
      `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "A student";

    await createNotification({
      userId: teacherId,
      userRole: "teacher",
      title: "New hire request",
      message: `${studentName} sent you a tutoring request.`,
      type: "hire",
      metadata: {
        requestId: request.id,
        studentId: req.user.id,
        teacherId,
      },
    }).catch(() => null);

    return res.status(201).json({
      success: true,
      message: "Hire request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send hire request",
      errors: [error.message],
    });
  }
};
