import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createProfile, editProfile, getAllProfiles, getProfileByIdUser } from '../handlers/profile.handler.js';

const profileRouter = Router();

// Create Profile
// ==============
profileRouter.post('/create', verifyToken, createProfile);
// Update Profile
// ==============
profileRouter.put("/update", verifyToken, editProfile);
// Get Profile of User
// ===================
profileRouter.get('/myprofile', verifyToken, getProfileByIdUser);
// Get All 'Visible' Profiles
// ======================
profileRouter.get("/profiles", verifyToken, getAllProfiles);

export default profileRouter;