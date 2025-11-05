import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { editProfile, getAllProfiles, getProfileById, getSelfProfile, getVisibleProfiles } from '../handlers/profile.handler.js';

const profileRouter = Router();

// Read
profileRouter.get('/admin/profiles', verifyToken, getAllProfiles)

// Read 'Visibible = true'
profileRouter.get("/profiles", verifyToken, getVisibleProfiles);

// Detail Self
profileRouter.get('/profile-detail', verifyToken, getSelfProfile);

// Update
profileRouter.put("/profile-update", verifyToken, editProfile);

// Detail Others
profileRouter.get("/profile-detail/:idUser", verifyToken, getProfileById)


export default profileRouter;