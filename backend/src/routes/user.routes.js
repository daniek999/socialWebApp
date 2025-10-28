import { Router } from 'express';
import { deleteUser, getUserById, getUsers } from '../handlers/user.handler.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

const userRouter = Router();


// Read ['Admin FUN']
userRouter.get('/all', verifyToken, verifyAdmin, getUsers);

// Detail
userRouter.get('/user-detail/:_id', getUserById);

// Delete -- When a user is delete, all his posts, comments and profile will be delete to.
userRouter.delete('/user-delete/:_id', verifyToken, verifyAdmin, deleteUser);

export default userRouter;