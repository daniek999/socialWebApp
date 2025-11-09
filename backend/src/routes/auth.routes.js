import { Router } from "express";
import { login, register, verifyEmail } from "../handlers/auth.handler.js";

const authRoutes = Router();

/* --------------------------------------------------------------------------
 AUTH ROUTES
-----------------------------------------------------------------------------
 - POST     /auth/register          -> Registrar nuevo usuario
 - POST     /auth/login             -> Iniciar sesión
 - GET      /auth/verify/:token     -> Verificar cuenta de usuario por token
-------------------------------------------------------------------------- */

// [PUBLIC] Registrar nuevo usuario
authRoutes.post('/register', register);
// [PUBLIC] Iniciar sesión de usuario
authRoutes.post('/login', login);
// [PUBLIC] Verificar correo electrónico mediante token
authRoutes.get('/verify/:token', verifyEmail)

export default authRoutes;