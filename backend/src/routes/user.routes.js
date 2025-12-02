import { Router } from 'express';
import { banUser, getBannedUsers, getOtherUsers, getSelfUser, getSuspendedUsers, getUsers, revokeBan, revokeSuspension, suspendUser } from '../handlers/user.handler.js';
import { verifyAdmin, verifyStatus, verifyToken, verifyVerification } from '../middleware/auth.js';

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * getUsers()               | GET       | Admin     | 'api/users/'
 * getSelfUser()            | GET       | Admin     | 'api/users/self'
 * getSuspendedUsers()      | GET       | Admin     | 'api/users/suspended'
 * getBanneddUsers()        | GET       | Admin     | 'api/users/banned'
 * getOtherUsers()          | GET       | Admin     | 'api/users/:idUser'
 * suspendUser()            | POST      | Admin     | 'api/users/suspend/:idUser'
 * revokeSuspension()       | PATCH     | Admin     | 'api/users/suspend/revoke/:idUser'
 * banUser()                | POST      | Admin     | 'api/users/ban/:idUser'
 * revokeBan()              | PATCH     | Admin     | 'api/users/ban/revoke/:idUser'
 * ---------------------------------------------------------------------------------
 */

const userRouter = Router();

// [MIDDLEWARES] 
userRouter.use(verifyToken);
userRouter.use(verifyVerification);
userRouter.use(verifyStatus);
userRouter.use(verifyAdmin);
// [ROUTES]
userRouter.get('/', getUsers);
userRouter.get('/self', getSelfUser);
userRouter.get('/suspended', getSuspendedUsers);
userRouter.get('/banned', getBannedUsers);
userRouter.get('/:idUser', getOtherUsers);
userRouter.post('/suspend/:idUser', suspendUser);
userRouter.patch('/suspend/revoke/:idUser', revokeSuspension);
userRouter.post('/ban/:idUser', banUser);
userRouter.patch('/ban/revoke/:idUser', revokeBan);

export default userRouter;