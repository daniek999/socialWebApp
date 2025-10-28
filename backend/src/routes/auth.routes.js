import { Router } from "express";
import { login, register, verifyEmail } from "../handlers/auth.handler.js";

const authRoutes = Router();

// Register User
authRoutes.post('/register', register);

// Login User
authRoutes.post('/login', login);

// Mail User Verification
authRoutes.get('/verify/:token', verifyEmail)

export default authRoutes;