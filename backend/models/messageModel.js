import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Message = sequelize.define(
  "Message",
  {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderRole: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverRole: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);
