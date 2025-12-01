import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const verifyToken = async (req, res, next) => {
    try {
        // (1) - Recoge y verifica la existencia del token en los headers o cookies.
        const authHeader = req.headers.authorization || req.cookies?.token;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se envio token' });
        } 
        // (2) - Lo une al -> 'Bearer <Token>'
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        // (3) - Verifica el token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // (4) - Busca al usuario 
        const user = await User.findById(payload.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Usuario no valido' });
        };
        // (5) - Guarda la data, para usos posteriores en otros handlers. Usar -> [ req.user.<DATA> ] para acceder a esta data.
        req.user = { 
            id: user._id.toString(), 
            username: user.username, 
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            status: user.status
        };
        // (6) - Continua al siguiente handler.
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'El Token es invalido o ha expirado.',
            error: error.message
        });
    };
};

export const verifyAdmin = (req, res, next) => {
    try {
        // (1) - Verifica el rol del usuario.
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso Denegado'})
        };
        // (2) - Continua al siguiente handler.
        next();
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error al verificar el rol del usuario.',
            error: error.message
        });
    };
};

export const verifyStatus = async (req, res, next) => {
    try {
        // (1) - Busca al usuario.
        const user = await User.findById(req.user.id);
        // (2) - Verifica si el usuario existe.
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        };
        // (3) - Verifica si el usuario esta suspendido.
        if (user.status === 'Suspendido') {
            return res.status(403).json({
                message: 'Tu cuenta se encuentra suspendida.',
                status: user.status
            });
        };
        // (4) - Verifica si el usuario esta baneado.
        if (user.status === 'Baneado') {
            return res.status(403).json({
                message: 'Tu cuenta se encuentra baneada.',
                status: user.status
            });
        };
        // (5) - Continua al siguiente handler.
        next();

    } catch (error) {
        return res.status(500).json({
            message: 'Error en la verificación del estado del usuario.',
            error: error.message
        });
    };
};

export const verifyVerification = async (req, res, next) => {
    try {
        // (1) - Busca al usuario.
        const user = await User.findById(req.user.id);
        // (2) - Verifica si el usuario existe.
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        };
        // (3) - Verifica si la cuenta del usuario esta verificada.
        if (req.user.isVerified === false) {
            return res.status(403).json({ 
                message: 'Tu cuenta aun no esta verificada.',
                status: req.user.status
            });
        };
        // (5) - Continua al siguiente handler.
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error en la validar si el usuario esta verificado.',
            error: error.message
        });
    };
};
