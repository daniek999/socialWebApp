import { Router } from "express";
import { login, register } from "../handlers/auth.handler.js";

const authRoutes = Router();

// Register User
authRoutes.post('/register', register);

// Login User
authRoutes.post('/login', login);


export default authRoutes;