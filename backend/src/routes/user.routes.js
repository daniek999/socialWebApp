import { Router } from 'express';
import { deleteUser, getOtherUsers, getSelfUser, getUsers } from '../handlers/user.handler.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

const userRouter = Router();

/* ==========================================================================
 USER ROUTES [4]
=============================================================================
 - GET      /api/users/                                 -> Listar todos los usuarios
 - GET      /api/users/self                             -> Obtener el perfil propio
 - GET      /api/users/:id                              -> Obtener detalle de un usuario por Id
 - DELETE   /api/users/:id                              -> Eliminar usuario por Id
========================================================================== */

// [GLOBAL] Middleware of token verification
userRouter.use(verifyToken);
// [GLOBAL] Middleware of role verification
userRouter.use(verifyAdmin);


// [ADMIN]
userRouter.get('/', getUsers);
// [ADMIN] 
userRouter.get('/self', getSelfUser);
// [ADMIN]
userRouter.get('/:idUser', getOtherUsers);
// [ADMIN]
userRouter.delete('/:idUser', deleteUser);

export default userRouter;