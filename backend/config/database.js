import { Sequelize } from "sequelize";

// Sequelize Instance
const database = new Sequelize(
  "tutornest",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await database.authenticate();
    console.log("✅ Database connected successfully");

    await database.sync({
      alter: true, // safer than force
    });

    console.log("✅ Database synced successfully");

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

export { database, connectDB };