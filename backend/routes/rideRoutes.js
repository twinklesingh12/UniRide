import express from "express";
import { getActiveRide } from "../controllers/rideController.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/active",
  authenticate,
  authorizeRoles("passenger"),
  getActiveRide
);

export default router;