import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connectionPool } from './config/connectionPool.js';
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import profileRouter from './routes/profile.routes.js';
import authRoutes from './routes/auth.routes.js';

// [Instances] app and initialize the connection to the database
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
connectionPool();

// [Usages]
app.use(express.json());                                                    // Reads JSON data.
app.use(cors());                                                            // Access to HTTP headers.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));    // Load static files

// [Routes]
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/profiles', profileRouter)

// [MIDDLEWARE]
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                message: 'El archivo excede el tamaño máximo permitido (2MB)' 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                message: 'Demasiados archivos enviados' 
            });
        }
        return res.status(400).json({ 
            message: `Error al subir archivo: ${error.message}` 
        });
    }
    
    // Errores personalizados del fileFilter
    if (error.message.includes('Solo se permiten')) {
        return res.status(400).json({ message: error.message });
    }
    
    // Otros errores
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
});


// [Server]
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log('Servidor Corriendo:')
});