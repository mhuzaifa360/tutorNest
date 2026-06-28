import { Meeting, Student, Teacher } from "../models/index.js";
import { createNotification } from "./notificationController.js";
import { approvedTeacherWhere } from "../utils/publicTeacher.js";

const meetingInclude = [
  {
    model: Student,
    as: "student",
    attributes: ["id", "firstName", "lastName", "profileImage"],
  },
  {
    model: Teacher,
    as: "teacher",
    attributes: ["id", "firstName", "lastName", "profileImage"],
  },
];

const emitNotification = (req, role, id, notification) => {
  if (!notification) return;
  req.app?.get("io")?.to(`user_${role}_${id}`).emit("notification_created", notification.toJSON());
};

export const createMeeting = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can schedule meetings" });
    }

    const teacherId = Number(req.body.teacherId);
    const startAt = new Date(req.body.startAt);
    const durationMinutes = Number(req.body.durationMinutes || 60);

    if (!teacherId || Number.isNaN(startAt.getTime()) || durationMinutes < 15) {
      return res.status(400).json({
        success: false,
        message: "teacherId, valid startAt and durationMinutes of at least 15 are required",
      });
    }

    const teacher = await Teacher.findOne({ where: approvedTeacherWhere({ id: teacherId }) });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const duplicate = await Meeting.findOne({
      where: {
        studentId: req.user.id,
        teacherId,
        startAt,
        status: { $in: ["pending", "accepted", "rescheduled"] },
      },
    });
    if (duplicate) {
      return res.status(409).json({ success: false, message: "A meeting already exists for this time" });
    }

    const meeting = await Meeting.create({
      studentId: req.user.id,
      teacherId,
      startAt,
      durationMinutes,
      notes: req.body.notes?.trim() || null,
      status: "pending",
    });

    const student = await Student.findById(req.user.id);
    const studentName = `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "A student";
    const notification = await createNotification({
      userId: teacherId,
      userRole: "teacher",
      title: "Meeting scheduled",
      message: `${studentName} requested a meeting.`,
      type: "meeting",
      metadata: { meetingId: meeting.id, studentId: req.user.id, teacherId },
    }).catch(() => null);
    emitNotification(req, "teacher", teacherId, notification);

    const data = await Meeting.findById(meeting.id, { include: meetingInclude });
    return res.status(201).json({ success: true, message: "Meeting requested", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const where =
      req.user.role === "student"
        ? { studentId: req.user.id }
        : req.user.role === "teacher"
          ? { teacherId: req.user.id }
          : {};

    const meetings = await Meeting.findAll({
      where,
      include: meetingInclude,
      order: [["startAt", "ASC"]],
    });

    return res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can update meeting requests" });
    }

    const meeting = await Meeting.findOne({
      where: { id: req.params.id, teacherId: req.user.id },
      include: meetingInclude,
    });
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    const { status, startAt, durationMinutes, rescheduleReason } = req.body;
    if (!["accepted", "rejected", "rescheduled", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid meeting status" });
    }

    const updates = { status };
    if (status === "rescheduled") {
      const nextStartAt = new Date(startAt);
      if (Number.isNaN(nextStartAt.getTime())) {
        return res.status(400).json({ success: false, message: "A valid startAt is required to reschedule" });
      }
      updates.startAt = nextStartAt;
      updates.durationMinutes = Number(durationMinutes || meeting.durationMinutes);
      updates.rescheduleReason = rescheduleReason?.trim() || null;
    }

    await meeting.update(updates);

    const notification = await createNotification({
      userId: meeting.studentId,
      userRole: "student",
      title: `Meeting ${status}`,
      message: `Your meeting request was ${status}.`,
      type: "meeting",
      metadata: { meetingId: meeting.id, status },
    }).catch(() => null);
    emitNotification(req, "student", meeting.studentId, notification);

    const data = await Meeting.findById(meeting.id, { include: meetingInclude });
    return res.status(200).json({ success: true, message: "Meeting updated", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
