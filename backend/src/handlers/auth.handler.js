import 'dotenv/config';
import User from "../models/user.js";
import Profile from '../models/profile.js';
import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { sendVerificationMail } from '../utils/mailer.js';

/**
 * ----------------
 * [ AUTH HANDLER ]
 * ----------------
 */

// [POST] - 'auth/register'
export const register = async (req, res) => {
    try {
        //#region [ Params ]
        const { email, username, password, role } = req.body;
        //#endregion

        //#region [ Validations ]
        // 1. Todos los inputs deben ser llenados
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Todos los campos deben ser llenados.' })
        }
        // 2. Si existe un email similar en la base de datos
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Correo ya esta registrado.' });
        }
        // 3. La clave debe ser mayor a 12 caracteres
        const passwordSize = password.length
        if (passwordSize < 12) {
            return res.status(400).json({ message: 'La clave debe tener al menos 12 caracteres.' });
        }
        //#endregion

        //#region [ Process ]
        // 1. Encripta la clave
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);
        // 2. Crear un nuevo Usuario
        const newUser = new User({
            username,
            email,
            password: hashedPass,
            role,
        });
        await newUser.save();
        // 3. Crear un nuevo Perfil
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
        // 4. Crear un token de verificacion para la validacion por correo
        const temporalMailToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        await sendVerificationMail(email, temporalMailToken);
        //#endregion

        //#region [ Result ]
        return res.status(201).json({
            message: 'Revisa tu correo para terminar tu registro.',
            user: newUser,
            profile: newProfile
        });
        //#endregion
    
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor -> ' + error });
    }
};
// [POST] - 'auth/login'
export const login = async (req, res) => {
    try {
        //#region [ Params ]
        const { email, password } = req.body;
        //#endregion

        //#region [ Validations ]
        // 1. Verifica que los parametros no esten vacios.
        if (!email || !password) {
            return res.status(400).json({ message: 'Debe ingresar correo y clave.' });
        }
        // 2. Verifica que el correo ya este registrado
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo no registrado.' });
        }
        // 3. Verifica que el usuario este verificado
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Debes verificar tu cuenta antes de iniciar sesión.' });
        }
        // 4. Verifica que la clave enviada sea la correspondiente 
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Clave incorrecta.' });
        }
        // 5. Verifica que la cuenta del usuario este 'Desactivada'
        if (user.state === false) {
            return res.status(400).json({ message: 'Tu cuenta se encuentra desactivada.' });
        }
        
        //#endregion

        //#region [ Process ]
        const payload = { 
            id: user._id, 
            role: user.role
        };
        const key = process.env.JWT_SECRET;
        // Create a digital signature [payload, key, options]
        const token = jwt.sign(
            payload,
            key,
            { expiresIn: '6h' },
        );
        //#endregion

        //#region [ Result ]
        return res.json({
            token,
            payload,
        });
        //#endregion

    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor -> ' + error });
    }
};
// [GET] - 'auth/verify/:token'
export const verifyEmail = async (req, res) => {
    try {
        //#region [ Params ]
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //#endregion

        //#region [ Validations ]
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (user.verified) {
            return res.status(200).json({ message: 'Tu cuenta ya está verificada.' });
        }
        //#endregion

        //#region [ Process ]
        user.isVerified = true;
        await user.save();
        //#endregion

        //#region [ Result ]
        // 1. JSON Response
        //res.status(200).json({ message: 'Cuenta verificada correctamente.' });
        // 2. Redirect Response
        res.status(200).redirect('http://localhost:4200/login?verified=true');
        //#endregion

    } catch (err) {
        console.error('Error en verificación:', err.message);
        return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};
