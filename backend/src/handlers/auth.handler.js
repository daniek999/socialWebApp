import 'dotenv/config';
import User from "../models/user.js";
import Profile from '../models/profile.js';
import jwt from 'jsonwebtoken';
import { genSalt, hash, compare } from 'bcryptjs';
import { sendVerificationMail } from '../utils/emailSenders.js';
import { grantAchievement } from '../utils/grantAchievement.js';
import { checkSuspension } from '../utils/checkSuspension.js';
import { checkBan } from '../utils/checkBan.js';

/** [ AUTH HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                           
 *  -------------------------------------------------------------------------
 *  register()              | Registra un nuevo usuario y envía correo de verificación.
 *  login()                 | Valida credenciales, revisa estado de cuenta y genera JWT.
 *  verification()          | Confirma la verificación del correo.
 */


//* [HANDLER ACTIONS]
export const register = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { email, username, password, role } = req.body;
        //#endregion

        //#region - | VERIFICATIONS |
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos deben ser llenados.',
            });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Correo ya registrado.',
            });
        }

        if (password.length < 12) {
            return res.status(400).json({
                success: false,
                message: 'La clave debe tener al menos 12 caracteres.',
            });
        }
        //#endregion

        //#region - | PROCESS       |
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
            name: 'Jhon',
            surname: 'Doe',
            birthday: Date.now(),
            interests: [],
            profession: 'Profesional',
            situation: 'Estudiante',
            description: 'Profesional | A | Tiempo | Completo ',
            about: 'Hola, soy nuevo en la plataforma.',
            skills: [],
            photo: "",
            curriculumvitae: "",
            visible: false,
        });
        await newProfile.save();

        const temporalMailToken = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        sendVerificationMail(email, temporalMailToken)
            .catch(err => console.error('Error enviando email:', err));
        //#endregion

        //#region - | RESULT        |
        return res.status(201).json({
            success: true,
            message: 'Ya falta poco, revisa tu correo para terminar tu registro.',
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al registrar al usuario.',
            error: error.message,
        });
        //#endregion
    };
};

export const login = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Recoge correo y contraseña enviados desde el formulario de login.
        const { email, password } = req.body;
        //#endregion

        //#region - | VERIFICATIONS |
        // (2) - Valida que ambos campos hayan sido enviados.
        if (!email || !password) {
            return res.status(400).json({ message: 'Debe ingresar correo y clave.' });
        }

        // (3) - Verifica si existe un usuario con dicho correo.
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo no registrado.' });
        }

        // (4) - Verifica si el usuario ya confirmó su correo electrónico.
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Debes verificar tu cuenta antes de iniciar sesión.' });
        }

        // (5) - Compara la clave ingresada contra la clave encriptada.
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Clave incorrecta.' });
        }

        // (6) - Verifica si la cuenta está suspendida.
        const isSuspended = await checkSuspension(user._id);
        if (!isSuspended.success) {
            return res.status(500).json({ message: isSuspended.error });
        }
        if (isSuspended.isSuspended) {
            return res.status(403).json({
                message: 'Tu cuenta está suspendida temporalmente.',
                suspendedUntil: isSuspended.suspendedUntil,
            });
        }

        // (7) - Verifica si la cuenta está baneada.
        const isBanned = await checkBan(user._id);
        if (!isBanned.success) {
            return res.status(400).json({ error: isBanned.error });
        }
        if (isBanned.isBanned) {
            return res.status(403).json({
                message: "Tu cuenta está baneada permanentemente.",
                reason: isBanned.reason,
            });
        }
        //#endregion

        //#region - | PROCESS       |
        // (8) - Genera un token JWT para la sesión.
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );
        //#endregion

        //#region - | RESULT        |
        // (9) - Retorna el token generado.
        return res.json({ token });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesion.',
            error: error.message,
        });
        //#endregion
    };
};
export const verification = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el token recibido desde el enlace enviado al correo del usuario.
        const { token } = req.params;

        //     - Decodifica el token utilizando la clave del backend.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //#endregion

        //#region - | PROCESS       |
        // (2) - Busca al usuario asociado al token decodificado.
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // (3) - Verifica si el usuario ya estaba verificado previamente.
        if (user.isVerified) {
            return res.status(200).json({ message: 'Tu cuenta ya está verificada.' });
        }

        // (4) - Cambia el estado del usuario a 'Verificado'.
        user.isVerified = true;
        await user.save();

        // (5) - Otorga el logro relacionado a la verificación de cuenta.
        await grantAchievement(user._id, "VERIFICACION_COMPLETA");
        //#endregion

        //#region - | RESULT        |
        // (6) - Redirige al login del cliente con un indicador de éxito.
        return res.status(200).redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(400).json({
            success: false,
            message: 'Token inválido o expirado.',
            error: error.message,
        });
        //#endregion
    }
};