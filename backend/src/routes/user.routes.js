import { Router } from 'express';
import { loginUser, registerUser } from '../handlers/user.handler.js';

const userRouter = Router();

// Register User
// =============
userRouter.post('/register', registerUser);
// Login User
// ==========
userRouter.post('/login', loginUser);

export default userRouter;