import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  failPayment,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createPaymentIntent);
router.post("/confirm", verifyToken, confirmPayment);
router.post("/fail", verifyToken, failPayment);

export default router;
