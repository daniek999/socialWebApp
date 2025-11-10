import 'dotenv/config';
import User from "../models/user.js";
import Profile from '../models/profile.js';
import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { sendVerificationMail } from '../utils/mailer.js';

/* ----- [ AUTH HANDLER] ----- */

// [POST] - 'auth/register'
export const register = async (req, res) => {
    try {
        // Params
        const { email, username, password, role } = req.body;

        // Verifications
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Todos los campos deben ser llenados.' })
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Correo ya esta registrado.' });
        }
        const passwordSize = password.length
        if (passwordSize < 12) {
            return res.status(400).json({ message: 'La clave debe tener al menos 12 caracteres.' });
        }

        // Process
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPass,
            role,
        });
        await newUser.save();
        const newProfile = new Profile({
            idUser: newUser._id,
            name: 'Tus Nombres',
            surname: 'Tus Apellidos',
            profession: 'Tu Profesion',
            employmentStatus: 'Estudiante',
            about: 'Deja que te conozcan; escribe algo acerca de ti.',
            photo: "",
            curriculumvitae: "",
            visible: false,
        });
        await newProfile.save();
        const temporalMailToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        await sendVerificationMail(email, temporalMailToken);

        // Response
        return res.status(201).json({
            message: 'Revisa tu correo para terminar tu registro.',
            user: newUser,
            profile: newProfile
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor -> ' + error });
    }
};

// [POST] - 'auth/login'
export const login = async (req, res) => {
    try {
        // 1. params
        const { email, password } = req.body;

        // 2. verifications
        if (!email || !password)
            return res.status(400).json({ message: 'Debe ingresar correo y clave.' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Correo no registrado.' });
        if (!user.isVerified)
            return res.status(401).json({ message: 'Debes verificar tu cuenta antes de iniciar sesión.' });

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch)
            return res.status(400).json({ message: 'Clave incorrecta.' });

        // 3. process
        const payload = { id: user._id, username: user.username, email: user.email, role: user.role, isVerified: user.isVerified };
        const key = process.env.JWT_SECRET;
        // Create a digital signature [payload, key, options]
        const token = jwt.sign(
            payload,
            key,
            { expiresIn: '1h' },
        );

        // 4. result
        return res.json({
            token,
            payload,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor -> ' + error });
    }
};

// [GET] - 'auth/verify/:token'
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (user.verified) {
            return res.status(200).json({ message: 'Tu cuenta ya está verificada.' });
        }

        user.isVerified = true;
        await user.save();

        // 1. JSON Response
        //res.status(200).json({ message: 'Cuenta verificada correctamente.' });
        // 2. Redirect Response
        res.status(200).redirect('http://localhost:4200/login?verified=true');
    } catch (err) {
        console.error('Error en verificación:', err.message);
        return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};
