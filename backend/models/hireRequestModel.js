import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const HireRequest = sequelize.define(
  "HireRequest",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "hirerequests",
    timestamps: true,
  }
);
