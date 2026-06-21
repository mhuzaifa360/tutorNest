import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const VerificationRequest = sequelize.define("VerificationRequest", {
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  cnicUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentUrls: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
