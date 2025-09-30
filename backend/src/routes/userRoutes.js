import { Router } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// -- User Router -- //
const userRouter = Router();

// 1. Register User
userRouter.post('/register', async (req, res) => {
    const { username,  email, password } = req.body;

    try {
        // 1. Verificar si existe el correo
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Correo ya existente' });

        // 2. Encriptar contraseña
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        // 3. Crear usuario
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor: ' + error });
    }
});
// 2. Login User
userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verify Data
        if (!email || !password) 
            return res.status(400).json({ message: 'Debe ingresar correo y clave' });

        const user = await User.findOne({ email });
        if (!user) 
            return res.status(400).json({ message: 'Correo no registrado' });

        const isMatch = await compare(password, user.password);
        if (!isMatch) 
            return res.status(400).json({ message: 'Clave incorrecta' });

        // 2. Generate JWT
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 3. Response
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error: ${error.message}` });
    }
});

export default userRouter;