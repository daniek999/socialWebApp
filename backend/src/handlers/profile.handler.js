import Profile from '../models/profile.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

/**
 * -------------------
 * [ PROFILE HANDLER ]
 * -------------------
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// [GET] - 'profiles/'
export const getCustomProfiles = async (req, res) => {
    try {
        //#region [ Process ]
        const visibleUserProfiles = await Profile
            .find({ visible: true })
            .populate("idUser", "username")
            .select('-curriculumvitae');
        //#endregion

        //#region [ Result ]
        return res.status(200).json(visibleUserProfiles);
        //#endregion

    } catch (error) {
        console.error("Error en [getCustomProfiles]: " + error);
        return res.status(500).json({ 
            message: "Error al obtener perfiles públicos",
            error: error.message
        });
    }
};
// [GET] - 'profiles/all'
export const getAllProfiles = async (req, res) => {
    try {
        //#region [ Process ]
        const profiles = await Profile.find();
        //#endregion

        //#region [ Result ]
        return res.status(200).json(profiles);
        //#endregion

    } catch (error) {
        console.error("Error en [getAllProfiles]: " + error);
        return res.status(400).json({ 
            message: "Error al obtener todos los perfiles",
            error: error.message
        });
    }
};
// [GET] - 'profiles/self'
export const getSelfProfile = async (req, res) => {
    try {
        //#region [ Params ]
        const idUser = req.user.id;
        const username = req.user.username;
        //#endregion

        //#region [ Process ]
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified createdAt");
        //#endregion

        //#region [ Validations ]
        if (!userProfile) {
            return res.status(404).json({ 
                message: `El usuario '${username}' no posee un perfil.` 
            });
        }
        //#endregion

        //#region [ Result ]
        return res.status(200).json(userProfile);
        //#endregion

    } catch (error) {
        console.error("Error en [getSelfProfile]: " + error);
        return res.status(500).json({ 
            message: "Error al obtener perfil del usuario",
            error: error.message
        });
    }
};
// [GET] - 'profiles/:idUser'
export const getOtherProfiles = async (req, res) => {
    try {
        //#region [ Params ]
        const { idUser } = req.params;
        const myUserId = req.user.id;
        //#endregion

        //#region [ Process ]
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified");
        //#endregion

        //#region [ Validations ]
        if (!userProfile) {
            return res.status(404).json({ message: "Perfil no encontrado." });
        }

        if (!userProfile.visible && myUserId !== idUser) {
            return res.status(403).json({ message: "Este perfil es privado." });
        }
        //#endregion

        //#region [ Result ]
        return res.status(200).json(userProfile);
        //#endregion

    } catch (error) {
        console.error("Error en [getOtherProfiles]: " + error);
        return res.status(500).json({ 
            message: "Error al obtener perfil ajeno",
            error: error.message
        });
    }
};
// [PUT] - 'profiles/self-update'
export const updateProfile = async (req, res) => {
    try {
        //#region [ Params ]
        const idUser = req.user.id;
        const { name, surname, profession, employmentStatus, about, visible } = req.body;

        const updateProfileData = { 
            name, surname, profession, employmentStatus, about, visible 
        };
        //#endregion

        //#region [ Validations ]
        const validStatuses = ['Estudiante', 'Buscando', 'Practicante', 'Empleado'];

        if (employmentStatus && !validStatuses.includes(employmentStatus)) {
            return res.status(400).json({ 
                message: `Estado de empleo inválido. Debe ser uno de: ${validStatuses.join(', ')}` 
            });
        }

        const existingProfile = await Profile.findOne({ idUser });
        //#endregion

        //#region [ Process ]
        // Archivos subidos
        if (req.files) {
            if (req.files.photo?.[0]) {
                if (existingProfile?.photo) {
                    await deleteOldFile(existingProfile.photo);
                }
                updateProfileData.photo = `/uploads/photos/${req.files.photo[0].filename}`;
            }

            if (req.files.curriculumvitae?.[0]) {
                if (existingProfile?.curriculumvitae) {
                    await deleteOldFile(existingProfile.curriculumvitae);
                }
                updateProfileData.curriculumvitae = `/uploads/cvs/${req.files.curriculumvitae[0].filename}`;
            }
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser },
            updateProfileData,
            { new: true, runValidators: true }
        );
        //#endregion

        //#region [ Validations - Post ]
        if (!updatedProfile) {

            if (req.files?.photo?.[0]) {
                await deleteOldFile(`/uploads/photos/${req.files.photo[0].filename}`);
            }
            if (req.files?.curriculumvitae?.[0]) {
                await deleteOldFile(`/uploads/cvs/${req.files.curriculumvitae[0].filename}`);
            }

            return res.status(404).json({ message: "Perfil no encontrado" });
        }
        //#endregion

        //#region [ Result ]
        return res.status(200).json(updatedProfile);
        //#endregion

    } catch (error) {

        if (req.files?.photo?.[0]) {
            await deleteOldFile(`/uploads/photos/${req.files.photo[0].filename}`);
        }
        if (req.files?.curriculumvitae?.[0]) {
            await deleteOldFile(`/uploads/cvs/${req.files.curriculumvitae[0].filename}`);
        }

        console.error("Error en [updateProfile]: " + error);
        return res.status(500).json({ 
            message: "Error al editar el perfil",
            error: error.message
        });
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