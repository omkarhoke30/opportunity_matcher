import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import profileController from '../controllers/profile.controller.js'
const router= express.Router();

// create the profile 
router.post("/",authMiddleware,profileController.createProfile);


// get the logged in user profile
router.get("/",authMiddleware,profileController.getMyProfile);

// update the logged in user profile
router.put(
    "/",
    authMiddleware,
    profileController.updateMyProfile
);

export default router;