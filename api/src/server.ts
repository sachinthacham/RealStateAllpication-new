import { config } from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { logger } from "./config/logger.js";

config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  logger.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    logger.info("✅ MongoDB connected");
    app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error("❌ DB connection failed", err);
    process.exit(1);
  });
