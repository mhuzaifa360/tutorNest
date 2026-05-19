import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Sequelize Instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.NODE_ENV === "development" ? false : false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({
      alter: true,
    });

    console.log("✅ Database synced successfully");

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

export { sequelize, connectDB };