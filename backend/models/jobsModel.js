import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Job = sequelize.define("Job", {
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

  mode: {
    type: DataTypes.ENUM("online", "home"),
    defaultValue: "home",
  },

  status: {
    type: DataTypes.ENUM("open", "in-progress", "closed"),
    defaultValue: "open",
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});