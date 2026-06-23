import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Review = sequelize.define("Review", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});