import SequelizePkg from "sequelize";
const { Sequelize } = SequelizePkg;
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
    logging: console.log,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // sync() only creates missing tables — does NOT alter existing ones.
    // Use force:true ONE TIME only to drop & recreate all tables (resets data!).
    // Never use alter:true in production — it stacks duplicate indexes on every restart.
    await sequelize.sync({ logging: console.log });

    console.log("✅ Database synced successfully");

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

export { sequelize, connectDB };