import { Router } from "express";
import { login, register, verifyEmail } from "../handlers/auth.handler.js";

const authRoutes = Router();

/* ==========================================================================
 AUTH ROUTES
=============================================================================
 - POST     /auth/register                              -> Registrar nuevo usuario
 - POST     /auth/login                                 -> Iniciar sesión
 - GET      /auth/verify/:token                         -> Verificar correo electrónico mediante token
========================================================================== */

// [PUBLIC]
authRoutes.post('/register', register);
// [PUBLIC]
authRoutes.post('/login', login);
// [PUBLIC] 
authRoutes.get('/verify/:token', verifyEmail)

export default authRoutes;