import express from "express";
import {
  getActiveRide,
  searchRides,
} from "../controllers/rideController.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get(
  "/",
  authenticate,
  authorizeRoles("passenger"),
  searchRides
);
router.get(
  "/active",
  authenticate,
  authorizeRoles("passenger"),
  getActiveRide
);

export default router;