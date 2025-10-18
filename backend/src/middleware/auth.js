import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Verify JWT
export const verifyToken = async (req, res, next) => {
    try {
        // 1) Read Token
        const authHeader = req.headers.authorization || req.cookies?.token;
        if (!authHeader) return res.status(401).json({ message: 'No se envio token' });

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        // 2) Verify Token
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Usuario no valido' });

        // 4) Save data, use -> [ req.user.(smthElse) ] to access to this data.
        req.user = { 
            id: user._id.toString(), 
            username: user.username, 
            email: user.email 
        };

        next();
    } catch (err) {
        console.error('Error: ', err.message);
        return res.status(401).json({ message: 'El Token es invalido o ha expirado.' });
    }
};

// Verify user role
export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso Denegado' })
    }
    next();
}
