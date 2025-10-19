import 'dotenv/config';
import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import Profile from '../models/profile.js';

// MARK: [POST] registerUser
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Verify if the mail already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Correo ya existente' });
        }

        // 2. Encrypting the password
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        // 3. Creating the new user
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });
        await newUser.save();

        // 4. Creating the new profile which belongs to the new user created.
        const newProfile = new Profile({
            idUser: newUser._id,
            name: '',
            surname: '',
            profession: '',
            interests: [],
            hobbies: [],
            visible: true
        });
        await newProfile.save();

        // 5. Response
        return res.status(201).json({
            message: 'Cuenta creada correctamente con perfil por defecto.',
            user: newUser,
            profile: newProfile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor -> ' + error });
    }
}

// MARK: [POST] loginUser
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