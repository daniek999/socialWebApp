import { Router } from 'express';
import { verifyAdmin, verifyStatus, verifyToken, verifyVerification } from '../middleware/auth.js';
import { getAllProfiles, getCustomProfiles, getOtherProfiles, getSelfProfile, updateProfile } from '../handlers/profile.handler.js';
import { upload, validateFileSize } from '../middleware/upload.js';

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * getCustomProfiles()      | GET       | User      | 'api/profiles'
 * getSelfProfile()         | GET       | User      | 'api/profiles/self'
 * getAllProfiles()         | GET       | User      | 'api/profiles/all'
 * updateProfile()          | PUT       | Admin     | 'api/profiles/self-update'
 * getOtherProfiles()       | GET       | User      | 'api/profiles/:idUser'
 * ---------------------------------------------------------------------------------
 */

const profileRouter = Router();

// [MIDDLEWARES]
profileRouter.use(verifyToken);
profileRouter.use(verifyVerification);
profileRouter.use(verifyStatus);
// [ROUTES]
profileRouter.get('/', getCustomProfiles);
profileRouter.get('/self', getSelfProfile);
profileRouter.get('/all', verifyAdmin, getAllProfiles);
profileRouter.put('/self-update', 
    upload.fields([ { name: 'photo', maxCount: 1 }, { name: 'curriculumvitae', maxCount: 1}]), 
    validateFileSize, 
    updateProfile
);
profileRouter.get('/:idUser', getOtherProfiles);

export default profileRouter;