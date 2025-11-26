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

// [GET] - 'profiles/' → User
export const getCustomProfiles = async (req, res) => {
    try {
        // Process
        const visibleProfiles = await Profile
            .find({ visible: true })
            .populate("idUser", "username")
            .select("-curriculumvitae -socialLinks");

        // Result
        return res.status(200).json({
            success: true,
            message: "Perfiles públicos obtenidos correctamente",
            data: visibleProfiles
        });

    } catch (error) {
        //console.error("Error en [getCustomProfiles]: " + error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfiles públicos",
            error: error.message
        });
    }
};

// [GET] - 'profiles/all' → Admin
export const getAllProfiles = async (req, res) => {
    try {
        // Process
        const profiles = await Profile
            .find()
            .select("-socialLinks");

        // Result
        return res.status(200).json({
            success: true,
            message: "Todos los perfiles obtenidos correctamente",
            data: profiles
        });

    } catch (error) {
        console.error("Error en [getAllProfiles]: " + error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener todos los perfiles",
            error: error.message
        });
    }
};

// [GET] - 'profiles/self' → User
export const getSelfProfile = async (req, res) => {
    try {
        // Params
        const idUser = req.user.id;

        // Process
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified createdAt")
            .select("-socialLinks");

        // Verifications
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "No tienes un perfil creado"
            });
        }

        // Result
        return res.status(200).json({
            success: true,
            message: "Perfil del usuario obtenido correctamente",
            data: userProfile
        });

    } catch (error) {
        //console.error("Error en [getSelfProfile]: " + error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfil del usuario",
            error: error.message
        });
    }
};

// [GET] - 'profiles/:idUser' → User
export const getOtherProfiles = async (req, res) => {
    try {
        // Params
        const { idUser } = req.params;
        const requestUserId = req.user.id;

        // Proccess
        const profile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified")
            .select("-socialLinks");

        // Verifications
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Perfil no encontrado"
            });
        }
        if (!profile.visible && requestUserId !== idUser) {
            return res.status(403).json({
                success: false,
                message: "Este perfil es privado"
            });
        }

        // Result
        return res.status(200).json({
            success: true,
            message: "Perfil ajeno obtenido correctamente",
            data: profile
        });

    } catch (error) {
        //console.error("Error en [getOtherProfiles]: " + error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfil ajeno",
            error: error.message
        });
    }
};

// [PUT] - 'profiles/self-update' → User
export const updateProfile = async (req, res) => {
    try {
        // Params
        const idUser = req.user.id;
        const {
            name,
            surname,
            birthday,
            interests,
            profession,
            situation,
            description,
            about,
            skills,
            visible
        } = req.body;

        // Validations
        // 1. Normalizar arrays (acepta string separado por coma o array)
        const normalizeArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            return value.split(",").map(v => v.trim()).filter(Boolean);
        };
        const updateData = {
            name,
            surname,
            birthday,
            interests: normalizeArray(interests),
            profession,
            situation,
            description,
            about,
            skills: normalizeArray(skills),
            visible
        };
        // 2. Eliminar undefined
        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );
        const existing = await Profile.findOne({ idUser });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Perfil no encontrado"
            });
        };
        // 3. Validad archivos subidos
        if (req.files) {
            // photo
            if (req.files.photo?.[0]) {
                if (existing.photo) await deleteOldFile(existing.photo);
                updateData.photo = `/uploads/photos/${req.files.photo[0].filename}`;
            }
            // cv
            if (req.files.curriculumvitae?.[0]) {
                if (existing.curriculumvitae) await deleteOldFile(existing.curriculumvitae);
                updateData.curriculumvitae = `/uploads/cvs/${req.files.curriculumvitae[0].filename}`;
            }
        };

        // Process
        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser },
            updateData,
            { new: true, runValidators: true }
        ).select("-socialLinks");

        // Result
        return res.status(200).json({
            success: true,
            message: "Perfil actualizado correctamente",
            data: updatedProfile
        });

    } catch (error) {
        // Borrar archivos subidos si algo falla
        if (req.files?.photo?.[0]) {
            await deleteOldFile(`/uploads/photos/${req.files.photo[0].filename}`);
        }
        if (req.files?.curriculumvitae?.[0]) {
            await deleteOldFile(`/uploads/cvs/${req.files.curriculumvitae[0].filename}`);
        }
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el perfil",
            error: error.message
        });
        console.error("Error en [updateProfile]: " + error);
    }
};

// Auxiliar: Eliminar archivos del servidor
const deleteOldFile = async (filePath) => {
    if (!filePath) return;
    try {
        const fullPath = path.join(__dirname, '../../uploads', filePath.replace('/uploads/', ''));
        await fs.unlink(fullPath);
        console.log("Archivo eliminado:", filePath);
    } catch (error) {
        console.log("Error eliminando archivo:", error.message);
    }
};
