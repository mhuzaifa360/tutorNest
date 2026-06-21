import express from "express";
import {
  getConversationMessages,
  getConversations,
  sendMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/conversations/:userId", verifyToken, getConversations);
router.get("/:conversationId", verifyToken, getConversationMessages);

export default router;
