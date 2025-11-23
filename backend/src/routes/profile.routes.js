import { Router } from 'express';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';
import { getAllProfiles, getCustomProfiles, getOtherProfiles, getSelfProfile, updateProfile } from '../handlers/profile.handler.js';
import { upload, validateFileSize } from '../middleware/upload.js';

const profileRouter = Router();

/* ==========================================================================
 PROFILE ROUTES [5]
=============================================================================
 - GET      /api/profiles                               -> Listar todos los perfiles que esten marcados como visibles
 - GET      /api/profiles/self                          -> Obtener el perfil propio
 - GET      /api/profiles/all                           -> Listar todos los perfiles
 - PUT      /api/profiles/self-update                   -> Actualizar perfil propio
 - GET      /api/profiles/:idUser                       -> Obtener perfil de otro usuario
========================================================================== */

// [GLOBAL] Middleware of token verification for all routes below
profileRouter.use(verifyToken);

// [USER] 
profileRouter.get('/', getCustomProfiles);
// [USER]
profileRouter.get('/self', getSelfProfile);
// [ADMIN]
profileRouter.get('/all', verifyAdmin, getAllProfiles);
// [USER]
profileRouter.put('/self-update', 
    upload.fields([ { name: 'photo', maxCount: 1 }, { name: 'curriculumvitae', maxCount: 1}]), 
    validateFileSize, 
    updateProfile
);
// [USER] 
profileRouter.get('/:idUser', getOtherProfiles);

export default profileRouter;