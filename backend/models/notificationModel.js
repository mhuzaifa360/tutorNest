import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Notification = sequelize.define(
  "Notification",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userRole: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "application",
        "job",
        "review",
        "message",
        "registration",
        "hire",
        "enrollment",
        "meeting",
        "call",
        "system"
      ),
      defaultValue: "system",
    },

    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);
