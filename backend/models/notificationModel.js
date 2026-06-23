import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Notification = sequelize.define("Notification", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM(
      "application",
      "job",
      "review",
      "system"
    ),
    defaultValue: "system",
  },

  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});