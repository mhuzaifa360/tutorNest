import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Application = sequelize.define(
  "Application",
  {
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    expectedFee: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "applications",
    timestamps: true,
  }
);
