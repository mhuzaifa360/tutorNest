import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Job = sequelize.define(
  "Job",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    budget: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
    },

    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    classLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    preferredGender: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    mode: {
      type: DataTypes.ENUM("online", "home", "both"),
      defaultValue: "home",
    },

    status: {
      type: DataTypes.ENUM("open", "in-progress", "assigned", "closed"),
      defaultValue: "open",
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assignedTeacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);
