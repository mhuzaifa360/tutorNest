import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
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

router.get(
  "/unread/:userId",
  verifyToken,
  getUnreadCount
);

router.put(
  "/markAllAsRead",
  verifyToken,
  markAllAsRead
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