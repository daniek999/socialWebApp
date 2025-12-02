import 'dotenv/config';
import User from "../models/user.js";
import Profile from '../models/profile.js';
import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { sendVerificationMail } from '../utils/sendVerificationMail.js';
import { grantAchievement } from '../utils/grantAchievement.js';
import { checkSuspension } from '../utils/checkSuspension.js';
import { checkBan } from '../utils/checkBan.js';

/** [ AUTH HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                           
 *  -------------------------------------------------------------------------
 *  register()              | Registra un nuevo usuario, crea su 
 *                          | perfil inicial y envía correo de verificación.
 *  -------------------------------------------------------------------------
 *  login()                 | Valida credenciales, revisa estado de cuenta
 *                          | (verificación, suspensión, ban) y genera JWT.
 *  -------------------------------------------------------------------------
 *  verification()          | Confirma la verificación del correo, marca
 *                          | al usuario como verificado y asigna un logro.
 *  -------------------------------------------------------------------------
 */


//* [HANDLER ACTIONS]
export const register = async (req, res) => {
    try {
        // (1) - Recoge los valores enviados del formulario de registro.
        const { email, username, password, role } = req.body;

        // (2) - Valida que los campos obligatorios estén completos.
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos deben ser llenados.',
            });
        };

        // (3) - Verifica si el correo ya pertenece a un usuario existente.
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Correo ya registrado.',
            });
        };

        // (4) - Verifica el tamaño mínimo de la clave.
        if (password.length < 12) {
            return res.status(400).json({
                success: false,
                message: 'La clave debe tener al menos 12 caracteres.',
            });
        };

        // (5) - Genera un 'salt' y encripta la contraseña del usuario.
        const salt = await genSalt(10);
        const hashedPass = await hash(password, salt);

        // (6) - Crea el registro del usuario.
        const newUser = new User({
            username,
            email,
            password: hashedPass,
            role,
        });
        await newUser.save();

        // (7) - Crea el registro del perfil del usuario.
        const newProfile = new Profile({
            idUser: newUser._id,
            name: 'Tus Nombres',
            surname: 'Tus Apellidos',
            birthday: null,
            interests: [],
            profession: 'Tu Profesión',
            situation: 'Estudiante',
            description: 'Escribe una breve descripción profesional.',
            about: 'Deja que te conozcan; escribe algo acerca de ti.',
            skills: [],
            photo: "",
            curriculumvitae: "",
            socialLinks: {
                github: "",
                youtube: "",
                twitch: ""
            },
            visible: false,
        });
        await newProfile.save();

        // (8) - Genera token temporal para verificación de correo
        const temporalMailToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        await sendVerificationMail(email, temporalMailToken);

        // (9) - Envía respuesta informando que debe confirmar vía correo
        return res.status(201).json({
            success: true,
            message: 'Ya falta poco, revisa tu correo para terminar tu registro.',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al registrar al usuario.',
            error: error.message,
        });
    };
};
export const login = async (req, res) => {
    try {
        // (1) - Recoge los valores enviados del formulario de login.
        const { email, password } = req.body;

        // (2) - Verifica que los campos no estén vacíos.
        if (!email || !password) {
            return res.status(400).json({ message: 'Debe ingresar correo y clave.' });
        };

        // (3) - Verifica que el correo exista.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo no registrado.' });
        };

        // (4) - Verifica si el usuario ya confirmó su correo electrónico.
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Debes verificar tu cuenta antes de iniciar sesión.' });
        };

        // (5) - Compara la clave ingresada con la almacenada.
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Clave incorrecta.' });
        };

        // (6) - Verifica si la cuenta está suspendida.
        const isSuspended = await checkSuspension(user._id);
        if (!isSuspended.success) {
            return res.status(500).json({ 
                message: suspendCheck.error 
            });
        };
        if (isSuspended.isSuspended) {
            return res.status(403).json({
                message: 'Tu cuenta está suspendida temporalmente.',
                suspendedUntil: isSuspended.suspendedUntil
            });
        };

        // (7) - Verifica si la cuenta está baneada.
        const isBanned = await checkBan(user._id);
        if (!isBanned.success) {
            return res.status(400).json({ 
                error: isBanned.error 
            });
        };
        if (isBanned.isBanned) {
            return res.status(403).json({
                message: "Tu cuenta está baneada permanentemente.",
                reason: isBanned.reason
            });
        };

        // (8) - Genera un token JWT para autenticación.
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        // (9) - Retorna token de sesión al cliente.
        return res.json({ token });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesion.',
            error: error.message,
        });
    };
};
export const verification = async (req, res) => {
    try {
        // (1) - Obtiene token enviado desde el enlace del correo.
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // (2) - Busca el usuario asociado al token
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // (3) - Verifica si el usuario ya estaba verificado previamente
        if (user.isVerified) {
            return res.status(200).json({ message: 'Tu cuenta ya está verificada.' });
        };

        // (4) - Cambia el estado del usuario a 'Verificado' / 'true'
        user.isVerified = true;
        await user.save();

        // (5) - Otorga el logro ['VERIFICACION_COMPLETA']
        await grantAchievement(user._id, "VERIFICACION_COMPLETA");

        // (6) - Redirige al login del cliente con un estado de éxito
        return res.status(200).redirect('http://localhost:4200/login?verified=true');

    } catch (error) {
        return res.status(400).json({ 
            success: false,
            message: 'ken inválido o expirado.',
            error: error.message,
        });
    };
};
