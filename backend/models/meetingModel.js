import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Meeting = sequelize.define(
  "Meeting",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "rescheduled", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    rescheduleReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "meetings",
    timestamps: true,
  }
);
