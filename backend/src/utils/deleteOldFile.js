import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteOldFile = async (filePath) => {
    if (!filePath) return;
    try {
        const fullPath = path.join(__dirname, '../../uploads', filePath.replace('/uploads/', ''));
        await fs.unlink(fullPath);
        //console.log("Archivo eliminado:", filePath);
    } catch (error) {
        console.log("Error eliminando archivo:", error.message);
    };
};
