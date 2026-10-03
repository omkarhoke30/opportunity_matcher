import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/role.middlware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", authController.registerUser);

// POST /api/auth/login
router.post("/login", authController.loginUser);

// GET /api/auth/me
router.get("/me", authMiddleware, authController.getMe);

// POST /api/auth/logout  
router.post("/logout", authController.logoutUser);

// GET /api/auth/admin-test  (temporary: delete once real admin routes are used)
router.get("/admin-test", authMiddleware, adminMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Welcome Admin",
        user: req.user
    });
});

export default router;