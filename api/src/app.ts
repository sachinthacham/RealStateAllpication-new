import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import propertyRoutes from "./routes/property.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);

// property routes
app.use("/api/properties", propertyRoutes);

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// error handler (last)
app.use(errorHandler);

export default app;
