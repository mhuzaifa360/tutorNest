import express from "express";
import { createJob, getJobs,  getSingleJob, updateJob, deleteJob} from "../controllers/jobControllers.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE JOB | Role: student
router.post("/createJob",verifyToken,authorizeRoles("student"),createJob);

// GET ALL JOBS | Role: Authenticated Users (Teacher usually, but not explicitly restricted here)
router.get("/getJobs", verifyToken, getJobs); 

// GET SINGLE JOB | Role: Authenticated Users
router.get("/getSingleJob/:id", verifyToken, getSingleJob); 

// UPDATE JOB | Role: student
router.put("/updateJob/:id",verifyToken,authorizeRoles("student"),  updateJob);

// DELETE JOB | Role: student
router.delete("/deleteJob/:id",  verifyToken,authorizeRoles("student"),deleteJob);

export default router;