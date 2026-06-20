import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const SavedTeacher = sequelize.define(
  "SavedTeacher",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["studentId", "teacherId"],
      },
    ],
  }
);
