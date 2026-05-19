import express from "express";

import {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";

import {
  verifyToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE REVIEW (student only)
router.post("/createReview",verifyToken,authorizeRoles("student"),createReview);

// GET ALL
router.get("/getReviews", getReviews);

// GET SINGLE
router.get("/getSingleReview/:id", getSingleReview);

// UPDATE
router.put("/updateReview/:id",verifyToken,authorizeRoles("student"),updateReview);

// DELETE
router.delete("/deleteReview/:id",verifyToken,deleteReview);

export default router;