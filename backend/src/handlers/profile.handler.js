import Profile from '../models/profile.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----- [ PROFILE HANDLER] ----- */

// [GET] - 'profiles/'
export const getCustomProfiles = async (req, res) => {
    try {
        // Process
        const visibleUserProfiles = await Profile
            .find({visible: true})
            .populate("idUser", "username")
            .select('-curriculumvitae');

        // Result
        res.status(200).json(visibleUserProfiles);
    } catch (error) {
        res.status(500).json({ message: "Error al Obtener Perfiles Publicos -> " + error  })
    }
};

// [GET] - 'profiles/all'
export const getAllProfiles = async (req, res) => {
    try {
        // Process
        const profiles = await Profile.find();

        // Result
        res.status(200).json(profiles);
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error})
    }
}

// [GET] - 'profiles/self'
export const getSelfProfile = async (req, res) => {
    try {
        // Params
        const idUser = req.user.id
        const username = req.user.username
        
        // Process 
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified");

        // Verifications 
        if (!userProfile) {
            return res.status(404).json({ message: "El Usuario '" + username + "' no posee un perfil." });
        }

        // Result
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: "Error al Obtener Perfil del Usuario: " + error });
    }
};

// [GET] - 'profiles/:idUser'
export const getOtherProfiles = async (req, res) => {
    try {
        // Params
        const { idUser } = req.params;

        // Process
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified");

        // Verifications
        if (!userProfile) {
            return res.status(404).json({ message: "Perfil no encontrado." });
        }
        if (!userProfile.visible && req.user.id !== idUser) {
            return res.status(403).json({ message: "Este perfil es privado." });
        }

        // Result
        res.status(200).json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener perfil ajeno -> " + error });
    }
}

// [Put] - 'profiles/self-update'
export const updateProfile = async (req, res) => {
    try {
        // [Params]
        const idUser = req.user.id;                                                             // [Key]
        const { name, surname, profession, employmentStatus, about, visible } = req.body;       // [Req Data]
        const updateProfileData = { name, surname, profession, employmentStatus, about, visible };   // [new Data]

        // [Process] 
        // Validate the employmentStatus
        const validStatuses = ['Estudiante', 'Buscando', 'Practicante', 'Empleado'];
        if (employmentStatus && !validStatuses.includes(employmentStatus)) {
            return res.status(400).json({ message: `Estado de empleo inválido. Debe ser uno de: ${validStatuses.join(', ')}` });
        }
        const existingProfile = await Profile.findOne({ idUser });
        // Manage uploaded files
        if (req.files) {
            // Photo
            if (req.files.photo && req.files.photo[0]) {
                // Eliminar foto antigua si existe
                if (existingProfile?.photo) {
                    await deleteOldFile(existingProfile.photo);
                }
                // Asignar nueva foto
                updateProfileData.photo = `/uploads/photos/${req.files.photo[0].filename}`;
            }
            // Curriculum Vitae
            if (req.files.curriculumvitae && req.files.curriculumvitae[0]) {
                // Eliminar CV antiguo si existe
                if (existingProfile?.curriculumvitae) {
                    await deleteOldFile(existingProfile.curriculumvitae);
                }
                // Asignar nuevo CV
                updateProfileData.curriculumvitae = `/uploads/cvs/${req.files.curriculumvitae[0].filename}`;
            }
        }
        // Update the profile
        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser }, updateProfileData, { new: true, runValidators: true }
        );

        // [Verifications]
        if (!updatedProfile) {
            // Si hay error y se subieron archivos, eliminarlos
            if (req.files?.photo?.[0]) {
                await deleteOldFile(`/uploads/photos/${req.files.photo[0].filename}`);
            }
            if (req.files?.curriculumvitae?.[0]) {
                await deleteOldFile(`/uploads/cvs/${req.files.curriculumvitae[0].filename}`);
            }
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        // [Result]
        res.status(200).json(updatedProfile);
    } catch (error) {
        if (req.files?.photo?.[0]) {
            await deleteOldFile(`/uploads/photos/${req.files.photo[0].filename}`);
        }
        if (req.files?.curriculumvitae?.[0]) {
            await deleteOldFile(`/uploads/cvs/${req.files.curriculumvitae[0].filename}`);
        }
        console.error(error);
        res.status(500).json({ message: "Error al editar el perfil -> " + error });
    }
};


// MARK: Auxiliar Functions.
const deleteOldFile = async (filePath) => {
    if (filePath) {
        try {
            const fullPath = path.join(__dirname, '../../uploads', filePath.replace('/uploads/', ''));
            await fs.unlink(fullPath);
            console.log('Archivo antiguo eliminado:', filePath);
        } catch (error) {
            console.log('Error eliminando archivo antiguo:', error.message);
        }
    }
};