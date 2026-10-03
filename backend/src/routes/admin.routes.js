import express from "express";
import adminController from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/role.middlware.js";

const router = express.Router();

// every route in this file is admin-only
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get("/stats", adminController.getStats);

// GET /api/admin/students
router.get("/students", adminController.getStudents);

// DELETE /api/admin/students/:id
router.delete("/students/:id", adminController.removeStudent);

export default router;
