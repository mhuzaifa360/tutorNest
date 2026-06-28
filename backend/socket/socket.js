import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Application, Conversation, ChatMessage, Job, Teacher } from "../models/index.js";
import { approvedTeacherWhere } from "../utils/publicTeacher.js";

const getSocketToken = (socket) => {
  const auth = socket.handshake.auth || {};
  const token = auth.token || (socket.handshake.headers.authorization || "").split(" ")[1];
  return token;
};

const isParticipant = (user, conversation) => {
  if (!user || !conversation) return false;
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
  if (!isParticipant(user, conversation)) return false;
  return hasAcceptedApplication(conversation.studentId, conversation.teacherId);
};

const createChatPayload = (message) => ({
  id: message.id,
  conversationId: message.conversationId,
  senderId: message.senderId,
  senderRole: message.senderRole,
  message: message.message,
  messageType: message.messageType,
  isRead: message.isRead,
  createdAt: message.createdAt,
});

const userRoom = (role, id) => `user_${role}_${id}`;

export const setupSocket = (server) => {
  const onlineUsers = new Map();

  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = getSocketToken(socket);
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userKey = `${socket.user.role}:${socket.user.id}`;
    onlineUsers.set(userKey, socket.id);
    socket.join(userRoom(socket.user.role, socket.user.id));
    socket.emit("presence_snapshot", {
      online: Array.from(onlineUsers.keys()).map((key) => {
        const [role, id] = key.split(":");
        return { role, userId: Number(id) };
      }),
    });
    socket.broadcast.emit("user_online", {
      userId: socket.user.id,
      role: socket.user.role,
    });

    socket.on("typing_direct", ({ receiverRole, receiverId }) => {
      if (!receiverRole || !receiverId) return;
      socket.to(userRoom(receiverRole, receiverId)).emit("typing_direct", {
        senderId: socket.user.id,
        senderRole: socket.user.role,
      });
    });

    socket.on("stop_typing_direct", ({ receiverRole, receiverId }) => {
      if (!receiverRole || !receiverId) return;
      socket.to(userRoom(receiverRole, receiverId)).emit("stop_typing_direct", {
        senderId: socket.user.id,
        senderRole: socket.user.role,
      });
    });

    socket.on("call_invite", ({ receiverRole, receiverId, callType = "voice" }) => {
      if (!receiverRole || !receiverId || !["voice", "video"].includes(callType)) return;
      socket.to(userRoom(receiverRole, receiverId)).emit("incoming_call", {
        callerId: socket.user.id,
        callerRole: socket.user.role,
        callType,
        startedAt: new Date(),
      });
    });

    ["call_accept", "call_reject", "call_end", "webrtc_signal"].forEach((eventName) => {
      socket.on(eventName, ({ receiverRole, receiverId, ...payload }) => {
        if (!receiverRole || !receiverId) return;
        socket.to(userRoom(receiverRole, receiverId)).emit(eventName, {
          senderId: socket.user.id,
          senderRole: socket.user.role,
          ...payload,
        });
      });
    });

    socket.on("join_room", async ({ conversationId }) => {
      try {
        if (!conversationId) return;

        const conversation = await Conversation.findById(conversationId);
        if (!(await canUseConversation(socket.user, conversation))) return;

        const room = `chat_${conversationId}`;
        socket.join(room);
        socket.emit("joined_room", { conversationId });
      } catch (error) {
        socket.emit("socket_error", {
          success: false,
          message: error.message || "Unable to join conversation",
        });
      }
    });

    socket.on("send_message", async (payload, callback) => {
      try {
        const { conversationId, message, messageType = "text" } = payload || {};
        if (!conversationId || !message?.trim()) {
          return callback?.({ success: false, message: "conversationId and message are required" });
        }

        if (!["text", "image", "file"].includes(messageType)) {
          return callback?.({ success: false, message: "Invalid messageType" });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !(await canUseConversation(socket.user, conversation))) {
          return callback?.({ success: false, message: "Conversation not found or access denied" });
        }

        const chatMessage = await ChatMessage.create({
          conversationId,
          senderId: socket.user.id,
          senderRole: socket.user.role,
          message: message.trim(),
          messageType,
          isRead: false,
        });

        await conversation.update({
          lastMessage: message.trim(),
          lastMessageAt: new Date(),
        });

        const room = `chat_${conversationId}`;
        const payloadData = createChatPayload(chatMessage);

        io.to(room).emit("receive_message", payloadData);
        callback?.({ success: true, data: payloadData });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on("typing", async ({ conversationId }) => {
      if (!conversationId) return;
      const conversation = await Conversation.findById(conversationId);
      if (!(await canUseConversation(socket.user, conversation))) return;

      socket.to(`chat_${conversationId}`).emit("typing", {
        conversationId,
        userId: socket.user.id,
        role: socket.user.role,
      });
    });

    socket.on("stop_typing", async ({ conversationId }) => {
      if (!conversationId) return;
      const conversation = await Conversation.findById(conversationId);
      if (!(await canUseConversation(socket.user, conversation))) return;

      socket.to(`chat_${conversationId}`).emit("stop_typing", {
        conversationId,
        userId: socket.user.id,
        role: socket.user.role,
      });
    });

    socket.on("mark_read", async ({ conversationId }, callback) => {
      try {
        if (!conversationId) {
          return callback?.({ success: false, message: "conversationId is required" });
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !(await canUseConversation(socket.user, conversation))) {
          return callback?.({ success: false, message: "Conversation not found or access denied" });
        }

        await ChatMessage.update(
          { isRead: true },
          {
            where: {
              conversationId,
              senderRole: socket.user.role === "student" ? "teacher" : "student",
              isRead: false,
            },
          }
        );

        io.to(`chat_${conversationId}`).emit("messages_read", {
          conversationId,
          readerId: socket.user.id,
          readerRole: socket.user.role,
        });
        callback?.({ success: true });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on("leave_room", ({ conversationId }) => {
      if (!conversationId) return;
      const room = `chat_${conversationId}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userKey);
      socket.broadcast.emit("user_offline", {
        userId: socket.user.id,
        role: socket.user.role,
      });
    });
  });

  return io;
};
