import express from "express";
import { getMyBookings } from "../controllers/bookingController.js";
import {
  authenticate,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/mine",
  authenticate,
  authorizeRoles("passenger"),
  getMyBookings
);

export default router;