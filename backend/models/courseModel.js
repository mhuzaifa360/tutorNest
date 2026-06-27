import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Course = sequelize.define(
  "Course",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.FLOAT,
    },

    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);
