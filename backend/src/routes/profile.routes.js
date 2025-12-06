import { Router } from 'express';
import { verifyAdmin, verifyStatus, verifyToken, verifyVerification } from '../middleware/auth.js';
import { getAllProfiles, getCustomProfiles, getOtherProfiles, getSelfProfile, updateProfile, uploadProfileFiles } from '../handlers/profile.handler.js';

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
profileRouter.put('/self-update', uploadProfileFiles, updateProfile);
profileRouter.get('/:idUser', getOtherProfiles);

export default profileRouter;