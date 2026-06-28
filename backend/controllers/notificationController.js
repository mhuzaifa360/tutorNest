import { Notification } from "../models/index.js";

// CREATE NOTIFICATION
export const createNotification = async ({
  userId,
  userRole,
  title,
  message,
  type,
  metadata,
}) => {
  return await Notification.create({
    userId,
    userRole,
    title,
    message,
    type,
    metadata,
  });
};

const currentUserNotificationWhere = (req) => ({
  userId: req.user.id,
  $or: [{ userRole: req.user.role }, { userRole: null }],
});

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: currentUserNotificationWhere(req),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: notifications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (
      notification.userId !== req.user.id ||
      (notification.userRole && notification.userRole !== req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification",
      });
    }

    await notification.update({ isRead: true });

    return res.status(200).json({
      success: true,
      message: "Marked as read",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these notifications",
      });
    }

    const count = await Notification.count({
      where: {
        userId,
        isRead: false,
        $or: [{ userRole: req.user.role }, { userRole: null }],
      },
    });

    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          ...currentUserNotificationWhere(req),
          isRead: false,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id, ids, all } = req.body || {};

    if (all || (!id && !ids)) {
      await Notification.update(
        { isRead: true },
        {
          where: {
            ...currentUserNotificationWhere(req),
            isRead: false,
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Notifications marked as read",
        data: { all: true },
      });
    }

    const targetIds = Array.isArray(ids) ? ids : [id];
    await Notification.update(
      { isRead: true },
      {
        where: {
          id: { $in: targetIds.map(Number).filter(Boolean) },
          ...currentUserNotificationWhere(req),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read",
      data: { ids: targetIds },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error marking notifications as read",
      errors: [error.message],
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (
      notification.userId !== req.user.id ||
      (notification.userRole && notification.userRole !== req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      });
    }

    await notification.destroy();

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    });
  }
};

