import express from "express";
import {
  changePassword,
  deleteAccount,
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put("/update", verifyToken, updateMyProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
