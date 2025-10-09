import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/index";

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start", err);
  process.exit(1);
});
