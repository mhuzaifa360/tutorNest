import { DataTypes } from "sequelize";
import { database } from "../config/database.js";

const Student = database.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        len: [6, 100],
      },
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: true,
      },
    },

    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },

    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    classLevel: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    subjects: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    otherSubject: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    tableName: "students",
    timestamps: true,
  }
);

export default Student;