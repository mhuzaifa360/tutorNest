import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Conversation = sequelize.define(
  "Conversation",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
    indexes: [
      { fields: ["studentId"] },
      { fields: ["teacherId"] },
      { unique: true, fields: ["studentId", "teacherId"] },
    ],
  }
);
