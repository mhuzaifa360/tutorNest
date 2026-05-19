import express from "express";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET NOTIFICATIONS
router.get(
  "/getNotifications",
  verifyToken,
  getNotifications
);

// MARK AS READ
router.put(
  "/markAsRead/:id",
  verifyToken,
  markAsRead
);

// DELETE NOTIFICATION
router.delete(
  "/deleteNotification/:id",
  verifyToken,
  deleteNotification
);

export default router;