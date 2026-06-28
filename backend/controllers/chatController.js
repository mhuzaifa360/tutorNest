import SequelizePkg from "sequelize";
const { literal } = SequelizePkg;
import { Application, Conversation, ChatMessage, Job, Student, Teacher } from "../models/index.js";
import { approvedTeacherWhere } from "../utils/publicTeacher.js";

const validRoles = ["student", "teacher"];

const isValidRole = (role) => validRoles.includes(role);

const buildParticipant = (conversation, currentRole) => {
  const participant = currentRole === "student" ? conversation.teacher : conversation.student;
  if (!participant) return null;
  return {
    id: participant.id,
    firstName: participant.firstName || null,
    lastName: participant.lastName || null,
    profileImage: participant.profileImage || null,
    role: currentRole === "student" ? "teacher" : "student",
  };
};

const hasConversationAccess = (user, conversation) => {
  if (!conversation) return false;
  if (user.role === "student") return conversation.studentId === user.id;
  if (user.role === "teacher") return conversation.teacherId === user.id;
  return false;
};

const hasAcceptedApplication = async (studentId, teacherId) => {
  const accepted = await Application.findOne({
    where: {
      tutorId: teacherId,
      status: "accepted",
    },
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
        where: approvedTeacherWhere({ id: teacherId }),
        required: true,
      },
    ],
  });
  return Boolean(accepted);
};

const canUseConversation = async (user, conversation) => {
  if (!hasConversationAccess(user, conversation)) return false;
  return hasAcceptedApplication(conversation.studentId, conversation.teacherId);
};

export const createOrGetConversation = async (req, res) => {
  try {
    const studentId = Number(req.body.studentId);
    const teacherId = Number(req.body.teacherId);

    if (!studentId || !teacherId) {
      return res.status(400).json({ success: false, message: "studentId and teacherId are required" });
    }

    if (!isValidRole(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only students and teachers can create conversations" });
    }

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ success: false, message: "Student may only create their own conversation" });
    }

    if (req.user.role === "teacher" && req.user.id !== teacherId) {
      return res.status(403).json({ success: false, message: "Teacher may only create their own conversation" });
    }

    const canChat = await hasAcceptedApplication(studentId, teacherId);
    if (!canChat) {
      return res.status(403).json({
        success: false,
        message: "Chat opens only after the student accepts the teacher application",
      });
    }

    const [conversation] = await Conversation.findOrCreate({
      where: {
        studentId,
        teacherId,
      },
      defaults: {
        lastMessage: null,
        lastMessageAt: null,
      },
    });

    const result = await Conversation.findById(conversation.id, {
      include: [
        { model: Student, as: "student", attributes: ["id", "firstName", "lastName", "profileImage"] },
        {
          model: Teacher,
          as: "teacher",
          where: req.user.role === "student" ? approvedTeacherWhere() : undefined,
          attributes: ["id", "firstName", "lastName", "profileImage"],
          required: req.user.role === "student",
        },
      ],
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = Number(req.params.userId || req.user.id);
    if (!userId || req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!isValidRole(req.user.role)) {
      return res.status(403).json({ success: false, message: "Only students and teachers are allowed" });
    }

    const where = req.user.role === "student" ? { studentId: userId } : { teacherId: userId };

    const conversations = await Conversation.findAll({
      where,
      include: [
        { model: Student, as: "student", attributes: ["id", "firstName", "lastName", "profileImage"] },
        {
          model: Teacher,
          as: "teacher",
          where: req.user.role === "student" ? approvedTeacherWhere() : undefined,
          attributes: ["id", "firstName", "lastName", "profileImage"],
          required: req.user.role === "student",
        },
      ],
      order: [["lastMessageAt", "DESC"]],
      attributes: {
        include: [
          [
            literal(
              `(SELECT COUNT(*) FROM chat_messages WHERE chat_messages.conversationId = Conversation.id AND chat_messages.isRead = 0 AND chat_messages.senderRole != '${req.user.role}')`
            ),
            "unreadCount",
          ],
        ],
      },
    });

    const payload = conversations.map((conversation) => {
      const plain = conversation.toJSON();
      const participant = buildParticipant(plain, req.user.role);
      return {
        id: plain.id,
        studentId: plain.studentId,
        teacherId: plain.teacherId,
        lastMessage: plain.lastMessage,
        lastMessageAt: plain.lastMessageAt,
        participant,
        unreadCount: Number(plain.unreadCount) || 0,
      };
    });

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !(await canUseConversation(req.user, conversation))) {
      return res.status(404).json({ success: false, message: "Conversation not found or access denied" });
    }

    const messages = await ChatMessage.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });

    await ChatMessage.update(
      { isRead: true },
      {
        where: {
          conversationId,
          senderRole: req.user.role === "student" ? "teacher" : "student",
          isRead: false,
        },
      }
    );

    return res.status(200).json({ success: true, data: messages, conversationId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendChatMessage = async (req, res) => {
  try {
    const { conversationId, message, messageType = "text" } = req.body;

    if (!conversationId || !message?.trim()) {
      return res.status(400).json({ success: false, message: "conversationId and message are required" });
    }

    if (!["text", "image", "file"].includes(messageType)) {
      return res.status(400).json({ success: false, message: "Invalid messageType" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !(await canUseConversation(req.user, conversation))) {
      return res.status(404).json({ success: false, message: "Conversation not found or access denied" });
    }

    const chatMessage = await ChatMessage.create({
      conversationId,
      senderId: req.user.id,
      senderRole: req.user.role,
      message: message.trim(),
      messageType,
      isRead: false,
    });

    await conversation.update({
      lastMessage: message.trim(),
      lastMessageAt: new Date(),
    });

    return res.status(201).json({ success: true, data: chatMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
