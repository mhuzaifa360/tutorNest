import { Notification } from "../models/index.js";

// CREATE NOTIFICATION
export const createNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
  });
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { userId },
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
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== req.user.id) {
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

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== req.user.id) {
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

