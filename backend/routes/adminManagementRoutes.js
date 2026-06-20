import express from "express";
import {
  deleteAdminCourse,
  deleteAdminJob,
  deleteAdminReview,
  deleteUser,
  getAdminApplications,
  getAdminCourses,
  getAdminJobs,
  getAdminOverview,
  getAdminReviews,
  getAdminStudents,
  getAdminTeachers,
  getAllUsers,
  setTeacherStatus,
  updateAdminApplication,
  updateAdminCourse,
  updateAdminJob,
} from "../controllers/adminManagementController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/overview", getAdminOverview);
router.get("/users", getAllUsers);
router.delete("/users/:role/:id", deleteUser);

router.get("/students", getAdminStudents);
router.get("/teachers", getAdminTeachers);
router.put("/teachers/:id/status", setTeacherStatus);

router.get("/courses", getAdminCourses);
router.put("/courses/:id", updateAdminCourse);
router.delete("/courses/:id", deleteAdminCourse);

router.get("/jobs", getAdminJobs);
router.put("/jobs/:id", updateAdminJob);
router.delete("/jobs/:id", deleteAdminJob);

router.get("/applications", getAdminApplications);
router.put("/applications/:id", updateAdminApplication);

router.get("/reviews", getAdminReviews);
router.delete("/reviews/:id", deleteAdminReview);

export default router;
