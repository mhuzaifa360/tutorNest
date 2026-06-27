import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
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
    tableName: "savedteachers",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["studentId", "teacherId"],
      },
    ],
  }
);
