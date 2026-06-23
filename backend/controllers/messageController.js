import Admin from "../models/adminModel.js";
import { Message, Student, Teacher } from "../models/index.js";

const roleModels = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
};

const parseConversationId = (conversationId) => {
  const dashIndex = conversationId.indexOf("-");
  if (dashIndex <= 0) return null;
  const role = conversationId.slice(0, dashIndex);
  const id = Number(conversationId.slice(dashIndex + 1));
  if (!roleModels[role] || Number.isNaN(id)) return null;
  return { role, id };
};

const getParticipant = async (role, id) => {
  const Model = roleModels[role];
  if (!Model) return null;
  // Admin has "name" column, Student/Teacher have firstName/lastName
  const attributes = role === "admin" 
    ? ["id", "name", "email", "profileImage"]
    : ["id", "firstName", "lastName", "email", "profileImage"];
  const record = await Model.findById(id, { attributes });
  if (!record) return null;
  const plain = record.toJSON();
  const name =
    role === "admin"
      ? plain.name || "Admin"
      : `${plain.firstName || ""} ${plain.lastName || ""}`.trim() || "User";
  return { id: plain.id, role, name, email: plain.email, profileImage: plain.profileImage };
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

export const getConversations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.findAll({
      where: {
        $or: [
          { senderId: userId, senderRole: req.user.role },
          { receiverId: userId, receiverRole: req.user.role },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    const grouped = new Map();
    messages.forEach((message) => {
      const isSender =
        message.senderId === userId && message.senderRole === req.user.role;
      const otherRole = isSender ? message.receiverRole : message.senderRole;
      const otherId = isSender ? message.receiverId : message.senderId;
      const key = `${otherRole}-${otherId}`;

      if (!grouped.has(key)) {
        grouped.set(key, { key, lastMessage: message, unread: 0 });
      }

      if (
        !isSender &&
        message.receiverId === userId &&
        message.receiverRole === req.user.role &&
        !message.isRead
      ) {
        grouped.get(key).unread += 1;
      }
    });

    const conversations = await Promise.all(
      Array.from(grouped.values()).map(async (entry) => {
        const parsed = parseConversationId(entry.key);
        const participant = parsed
          ? await getParticipant(parsed.role, parsed.id)
          : null;
        return {
          id: entry.key,
          key: entry.key,
          conversationId: entry.key,
          name: participant?.name || entry.key,
          participant,
          lastMessage: entry.lastMessage?.body,
          lastMessageAt: entry.lastMessage?.createdAt,
          unread: entry.unread,
        };
      })
    );

    conversations.sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
    );

    return res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const parsed = parseConversationId(req.params.conversationId);
    if (!parsed) {
      return res.status(400).json({ success: false, message: "Invalid conversation id" });
    }

    const { role, id } = parsed;
    const messages = await Message.findAll({
      where: {
        $or: [
          {
            senderId: req.user.id,
            senderRole: req.user.role,
            receiverId: id,
            receiverRole: role,
          },
          {
            senderId: id,
            senderRole: role,
            receiverId: req.user.id,
            receiverRole: req.user.role,
          },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: id,
          senderRole: role,
          receiverId: req.user.id,
          receiverRole: req.user.role,
          isRead: false,
        },
      }
    );

    const participant = await getParticipant(role, id);

    return res.status(200).json({
      success: true,
      data: messages,
      participant,
      conversationId: req.params.conversationId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
