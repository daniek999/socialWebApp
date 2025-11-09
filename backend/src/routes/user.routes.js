import { Router } from 'express';
import { deleteUser, getOtherUsers, getSelfUser, getUsers } from '../handlers/user.handler.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

const userRouter = Router();

/* ---------------------------------------------------------------------------
 USER ROUTES
---------------------------------------------------------------------------
 - GET      /users/                 -> Listar todos los usuarios
 - GET      /users/self             -> Obtener el perfil propio
 - GET      /users/:id              -> Obtener detalle de un usuario específico
 - DELETE   /users/:id              -> Eliminar usuario
--------------------------------------------------------------------------- */

// [ADMIN] Obtener todos los usuarios
userRouter.get('/', verifyToken, verifyAdmin, getUsers);
// [ADMIN] Obtener detalle propio 
userRouter.get('/self', verifyToken, verifyAdmin, getSelfUser);
// [ADMIN] Obtener detalle de otro usuario
userRouter.get('/:idUser', verifyToken, verifyAdmin, getOtherUsers);
// [ADMIN] Eliminar usuario por ID
userRouter.delete('/:idUser', verifyToken, verifyAdmin, deleteUser);

export default userRouter;