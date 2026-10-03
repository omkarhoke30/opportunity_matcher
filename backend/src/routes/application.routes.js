import express from "express";
import applicationController from "../controllers/application.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/applications → apply
router.post("/", authMiddleware, applicationController.applyToOpportunity);

// GET /api/applications → my applications
router.get("/", authMiddleware, applicationController.getMyApplications);

// GET /api/applications/:id → one of my applications
router.get("/:id", authMiddleware, applicationController.getMyApplicationById);

export default router;
