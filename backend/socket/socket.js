import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Conversation, ChatMessage } from "../models/index.js";

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

export const setupSocket = (server) => {
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
    socket.on("join_room", async ({ conversationId }) => {
      if (!conversationId) return;

      const conversation = await Conversation.findByPk(conversationId);
      if (!isParticipant(socket.user, conversation)) return;

      const room = `chat_${conversationId}`;
      socket.join(room);
      socket.emit("joined_room", { conversationId });
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

        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation || !isParticipant(socket.user, conversation)) {
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

    socket.on("leave_room", ({ conversationId }) => {
      if (!conversationId) return;
      const room = `chat_${conversationId}`;
      socket.leave(room);
    });
  });

  return io;
};
