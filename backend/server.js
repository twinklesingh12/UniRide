import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { testDatabaseConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UniRide backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "UniRide API is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/drivers", driverRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Each document must be 5 MB or smaller",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error.message ===
    "Only JPG, PNG and PDF documents are allowed"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Unhandled server error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(PORT, () => {
      console.log(`UniRide backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();