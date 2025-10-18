import 'dotenv/config';
import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";

// 1.
export const registerUser = async (req, res) => {
    // Defyning
    const { 
        username,  
        email, 
        password 
    } = req.body;
    // Testing
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

        return res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor: ' + error });
    }
}

// 2.
export const loginUser = async (req, res) => {
    // Defyning
    const { 
        email, 
        password 
    } = req.body;
    // Testing
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
        const token = jwt.sign(payload, 'un_secreto_muy_forte', { expiresIn: '1h' });

        // 3. Response
        return res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error: ${ error }` });
    }
}