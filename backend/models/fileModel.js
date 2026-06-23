import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const FileRecord = sequelize.define("FileRecord", {
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerRole: {
    type: DataTypes.ENUM("student", "teacher", "admin"),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("profile", "document", "course", "verification"),
    allowNull: false,
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
