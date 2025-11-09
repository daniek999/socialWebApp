import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de límites
const FILE_SIZE_LIMITS = {
    photo: 2 * 1024 * 1024,        // 2MB para fotos
    curriculumvitae: 2 * 1024 * 1024  // 2MB para CVs
};

const ALLOWED_MIME_TYPES = {
    photo: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    curriculumvitae: ['application/pdf']
};

// Storage Settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = file.fieldname === 'photo' ? 'photos' : 'cvs';
        cb(null, path.join(__dirname, `../../uploads/${folder}`));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}_${uniqueSuffix}${ext}`);
    }
});

// File Filter Unificado
const fileFilter = (req, file, cb) => {
    const fieldName = file.fieldname;
    
    // Verificar si el campo es válido
    if (!ALLOWED_MIME_TYPES[fieldName]) {
        return cb(new Error(`Campo '${fieldName}' no válido`), false);
    }
    
    // Verificar tipo MIME
    if (!ALLOWED_MIME_TYPES[fieldName].includes(file.mimetype)) {
        const expectedTypes = fieldName === 'photo' 
            ? 'imágenes (JPG, PNG, GIF, WebP)' 
            : 'archivos PDF';
        return cb(new Error(`Solo se permiten ${expectedTypes} para ${fieldName}`), false);
    }
    
    cb(null, true);
};

// Configuración de Multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Límite general de 2MB
        files: 2 // Máximo 2 archivos por request
    }
});

// Middleware personalizado para validar tamaño por tipo de archivo
export const validateFileSize = (req, res, next) => {
    if (!req.files) return next();
    
    const errors = [];
    
    // Validar cada archivo
    Object.keys(req.files).forEach(fieldName => {
        const files = req.files[fieldName];
        const maxSize = FILE_SIZE_LIMITS[fieldName];
        
        if (!maxSize) {
            errors.push(`Tipo de archivo '${fieldName}' no permitido`);
            return;
        }
        
        files.forEach(file => {
            if (file.size > maxSize) {
                const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
                errors.push(
                    `El archivo '${file.originalname}' excede el tamaño máximo de ${maxSizeMB}MB`
                );
            }
        });
    });
    
    if (errors.length > 0) {
        return res.status(400).json({ 
            message: 'Error de validación de archivos',
            errors 
        });
    }
    
    next();
};