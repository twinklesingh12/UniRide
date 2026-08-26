import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { testDatabaseConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
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