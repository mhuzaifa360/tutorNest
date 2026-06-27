import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const SavedJob = sequelize.define(
  "SavedJob",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "savedjobs",
    timestamps: true,
  }
);
