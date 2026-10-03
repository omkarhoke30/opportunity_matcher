import express from "express";
import savedController from "../controllers/saved.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// every saved route needs a logged-in user
router.use(authMiddleware);

// GET /api/saved
router.get("/", savedController.getSaved);

// POST /api/saved/:opportunityId
router.post("/:opportunityId", savedController.saveOpportunity);

// DELETE /api/saved/:opportunityId
router.delete("/:opportunityId", savedController.unsaveOpportunity);

export default router;
