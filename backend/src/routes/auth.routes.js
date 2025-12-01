import { Router } from "express";
import { login, register, verification } from "../handlers/auth.handler.js";
import { verifyStatus } from "../middleware/auth.js";

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * register()               | POST      | Any       | 'api/auth/register'
 * login()                  | POST      | Any       | 'api/auth/login'
 * verification()           | GET       | Any       | 'api/auth/verify/:token'
 * ---------------------------------------------------------------------------------
 */

const authRoutes = Router();

// [ROUTES]
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/verify/:token', verification)

export default authRoutes;