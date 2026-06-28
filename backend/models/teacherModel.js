import SequelizePkg from "sequelize";
const { DataTypes } = SequelizePkg;
import { sequelize } from "../config/database.js";

const Teacher = sequelize.define(
  "Teacher",
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
      unique: "teacher_email_unique",

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

    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    experience: {
      type: DataTypes.INTEGER,
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

    teachingMode: {
      type: DataTypes.ENUM(
        "online",
        "home",
        "both"
      ),
      allowNull: false,
    },

    hourlyFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "teacher_cnic_unique",

      validate: {
        len: [13, 13],
      },
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected"
      ),

      defaultValue: "pending",
    },
  },

  {
    tableName: "teacher",
    timestamps: true,
  }
);

export default Teacher;
