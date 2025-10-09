import { errorHandler } from "./middlewares/errorHandler.middleware";
import propertyRoutes from "./routes/property.routes";
import wishlistRoutes from "./routes/wishList.routes";
import bookingRoutes from "./routes/booking.routes";
import visitRoutes from "./routes/visit.routes";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import express from "express";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes); // API routes
app.use("/api/properties", propertyRoutes); // property routes
app.use("/users", wishlistRoutes); // wishlist routes
app.use("/bookings", bookingRoutes); // booking routes
app.use("/api/visits", visitRoutes); // visit routes


//app.get("/api/health", (_req, res) => res.json({ ok: true })); // health

// error handler (last)
app.use(errorHandler);

export default app;
