import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getDriverBookingRequests,
  decideBooking,
} from "../controllers/bookingController.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.post(
  "/",
  authenticate,
  authorizeRoles("passenger"),
  createBooking
);
router.get(
  "/mine",
  authenticate,
  authorizeRoles("passenger"),
  getMyBookings
);
router.get(
  "/requests",
  authenticate,
  authorizeRoles("driver"),
  getDriverBookingRequests
);
router.post(
  "/:id/decision",
  authenticate,
  authorizeRoles("driver"),
  decideBooking
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("passenger"),
  getBookingById
);

export default router;