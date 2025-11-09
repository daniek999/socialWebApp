import { Router } from 'express';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';
import { getAllProfiles, getCustomProfiles, getOtherProfiles, getSelfProfile, updateProfile } from '../handlers/profile.handler.js';
import { upload, validateFileSize } from '../middleware/upload.js';

const profileRouter = Router();

/* --------------------------------------------------------------------------
 PROFILE ROUTES
-----------------------------------------------------------------------------
 - GET      /profiles               -> Listar perfiles visibles
 - GET      /profiles/self          -> Obtener el perfil propio
 - GET      /profiles/all           -> Listar todos los perfiles
 - PUT      /profiles/self-update   -> Actualizar perfil propio
 - GET      /profiles/:idUser       -> Obtener detalle de otro perfil
-------------------------------------------------------------------------- */

// [USER] Listar todos los perfiles que esten marcados como visibles
profileRouter.get('/', verifyToken, getCustomProfiles);
// [USER] Obtener perfil proio
profileRouter.get('/self', verifyToken, getSelfProfile);
// [ADMIN] Listar todos los perfiles
profileRouter.get('/all', verifyToken, verifyAdmin, getAllProfiles);
// [USER] Actualizar perfil propio
profileRouter.put('/self-update', verifyToken, 
    upload.fields([ { name: 'photo', maxCount: 1 }, { name: 'curriculumvitae', maxCount: 1}]), 
    validateFileSize, 
    updateProfile
);
// [USER] Obtener perfil de otro usuario
profileRouter.get('/:idUser', verifyToken, getOtherProfiles);

export default profileRouter;