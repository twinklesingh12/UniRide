import "dotenv/config";
import express from "express";
import cors from "cors";
import { testDatabaseConnection } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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