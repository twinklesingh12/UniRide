import express from "express";
import {
  createRide,
  getActiveRide,
  getFareQuote,
  getMyRides,
  getRideById,
  searchRides,
  updateRideStatus,
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
router.post(
  "/",
  authenticate,
  authorizeRoles("driver"),
  createRide
);
router.get(
  "/mine",
  authenticate,
  authorizeRoles("driver"),
  getMyRides
);
router.get(
  "/active",
  authenticate,
authorizeRoles("passenger", "driver"),
  getActiveRide
);
router.post(
  "/:id/status",
  authenticate,
  authorizeRoles("driver"),
  updateRideStatus
);
router.get(
  "/:id",
  authenticate,
  getRideById
);
router.get(
  "/:id/fare-quote",
  authenticate,
  authorizeRoles("passenger"),
  getFareQuote
);
export default router;