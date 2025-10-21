import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { editProfile, getAllProfiles, getProfileByIdUser, getVisibleProfiles } from '../handlers/profile.handler.js';

const profileRouter = Router();

// Read
profileRouter.get('/admin/profiles', verifyToken, getAllProfiles)

// Read 'Visibible = true'
profileRouter.get("/profiles", verifyToken, getVisibleProfiles);

// Detail
profileRouter.get('/profile-detail', verifyToken, getProfileByIdUser);

// Update
profileRouter.put("/profile-update", verifyToken, editProfile);


export default profileRouter;