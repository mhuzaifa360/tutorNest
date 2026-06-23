import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendChatMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create-or-get", verifyToken, createOrGetConversation);
router.get("/conversations/:userId", verifyToken, getConversations);
router.get("/messages/:conversationId", verifyToken, getMessages);
router.post("/send", verifyToken, sendChatMessage);

export default router;
