import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

export const Transaction = sequelize.define(
  "Transaction",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userRole: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PKR",
    },
    status: {
      type: DataTypes.ENUM("created", "pending", "confirmed", "failed"),
      allowNull: false,
      defaultValue: "created",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "mock",
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    invoice: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);
