import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Enrollment = sequelize.define(
  "Enrollment",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "enrollments",
    timestamps: true,
  }
);
