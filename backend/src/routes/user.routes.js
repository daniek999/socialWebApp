import { Router } from 'express';
import { deleteUser, getUserById, getUsers } from '../handlers/user.handler.js';

const userRouter = Router();

// NOTA: Agrgear el verifyToken para que solo sean son verificados admins capaces de acceder

// Read ['Admin FUN']
userRouter.get('/admin/users', getUsers);

// Detail
userRouter.get('/user-detail/:_id', getUserById);

// Delete -- When a user is delete, all his posts, comments and profile will be delete to.
userRouter.delete('/user-delete/:_id', deleteUser);

export default userRouter;