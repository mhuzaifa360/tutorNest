import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderRole: {
      type: DataTypes.ENUM("student", "teacher"),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file"),
      allowNull: false,
      defaultValue: "text",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "chat_messages",
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ["conversationId"] },
      { fields: ["senderId"] },
      { fields: ["senderRole"] },
    ],
  }
);
