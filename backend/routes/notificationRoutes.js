import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.get("/unread-count", verifyToken, (req, res) => {
  req.params.userId = req.user.id;
  return getUnreadCount(req, res);
});
router.patch("/read", verifyToken, markRead);

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
