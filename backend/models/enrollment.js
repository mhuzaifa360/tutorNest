import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Enrollment = sequelize.define("Enrollment", {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});