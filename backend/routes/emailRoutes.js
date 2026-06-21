import express from "express";
import {
  sendEmailVerification,
  sendPasswordReset,
  sendNotificationEmail,
} from "../controllers/emailController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", sendEmailVerification);
router.post("/reset-password", sendPasswordReset);
router.post(
  "/notification",
  verifyToken,
  authorizeRoles("admin"),
  sendNotificationEmail
);

export default router;
