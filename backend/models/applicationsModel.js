import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Application = sequelize.define("Application", {
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  tutorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});