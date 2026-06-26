import SequelizePkg from "sequelize";
const { Sequelize } = SequelizePkg;
import dotenv from "dotenv";

dotenv.config();

const shouldSyncDatabase = String(process.env.DB_SYNC || "").toLowerCase() === "true";
const shouldLogSql = String(process.env.DB_LOGGING || "").toLowerCase() === "true";

// Sequelize Instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: shouldLogSql ? console.log : false,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: Number(process.env.DB_POOL_MIN) || 0,
      acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: Number(process.env.DB_POOL_IDLE) || 10000,
    },
    retry: {
      max: Number(process.env.DB_RETRY_MAX) || 2,
      match: [/ECONNRESET/, /ETIMEDOUT/, /PROTOCOL_CONNECTION_LOST/],
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (shouldSyncDatabase) {
      // Opt-in only. sync() runs index inspection queries such as SHOW INDEX,
      // which can reset hosted/unstable MySQL connections during app boot.
      await sequelize.sync({ logging: shouldLogSql ? console.log : false });
      console.log("Database synced successfully");
    } else {
      console.log("Database sync skipped. Set DB_SYNC=true only for local schema setup.");
    }

    return true;
  } catch (error) {
    const reason =
      error.message ||
      error.parent?.message ||
      error.parent?.code ||
      error.original?.message ||
      error.name ||
      "Unknown database error";
    console.error("Database connection failed:", reason);
    return false;
  }
};

export { sequelize, connectDB };
