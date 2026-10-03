import express from "express";
import opportunityController from "../controllers/opportunity.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/role.middlware.js";

const router = express.Router();

// PUBLIC → VIEW ALL (the public Opportunities page needs this without login)
router.get("/", opportunityController.getAllOpportunities);

// PUBLIC → VIEW ONE
router.get("/:id", opportunityController.getOpportunityById);

// ADMIN → CREATE
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    opportunityController.createOpportunity
);

// ADMIN → UPDATE
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    opportunityController.updateOpportunity
);

// ADMIN → DELETE
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    opportunityController.deleteOpportunity
);

export default router;