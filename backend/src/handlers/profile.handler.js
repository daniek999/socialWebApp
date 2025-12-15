import Profile from '../models/profile.js';
import { grantAchievement } from '../utils/grantAchievement.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import multer from 'multer';

/** [ PROFILE HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                           
 *  -------------------------------------------------------------------------
 *  getCustomProfiles()     | Obtiene perfiles públicos visibles.
 *  getAllProfiles()        | Obtiene todos los perfiles sin links sociales.
 *  getSelfProfile()        | Obtiene el perfil del usuario autenticado.
 *  getOtherProfiles()      | Obtiene el perfil de otro usuario, respetando privacidad.
 *  updateProfile()         | Actualiza datos, archivos y logros del perfil.
 */


//* [HANDLER ACTIONS]
export const getCustomProfiles = async (req, res) => {
    try {
        //#region - | PROCESS       |
        // (1) - Obtiene los perfiles visibles (públicos), poblados con username
        const visibleProfiles = await Profile
            .find({ visible: true })
            .populate("idUser", "username")
            .select("-curriculumvitae -socialLinks");
        //#endregion

        //#region - | RESULT        |
        // (2) - Retorna un estado de éxito y los perfiles públicos
        return res.status(200).json({
            success: true,
            message: "Perfiles públicos obtenidos correctamente",
            data: visibleProfiles
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfiles públicos",
            error: error.message
        });
        //#endregion
    }
};
export const getAllProfiles = async (req, res) => {
    try {
        //#region - | PROCESS       |
        // (1) - Obtiene todos los perfiles, ocultando los enlaces sociales
        const profiles = await Profile
            .find()
            .select("-socialLinks");
        //#endregion

        //#region - | RESULT        |
        // (2) - Retorna todos los perfiles con mensaje de éxito
        return res.status(200).json({
            success: true,
            message: "Todos los perfiles obtenidos correctamente",
            data: profiles
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        console.error("Error en [getAllProfiles]: " + error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener todos los perfiles",
            error: error.message
        });
        //#endregion
    }
};
export const getSelfProfile = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del usuario autenticado desde el request
        const idUser = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // (2) - Busca el perfil del usuario y popula campos básicos del usuario
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified createdAt")
            .select("-socialLinks");
        //#endregion

        //#region - | VERIFICATIONS |
        // (3) - Verifica que el perfil exista
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: "No tienes un perfil creado"
            });
        }
        //#endregion

        //#region - | RESULT        |
        // (4) - Retorna el perfil encontrado con mensaje de éxito
        return res.status(200).json({
            success: true,
            message: "Perfil del usuario obtenido correctamente",
            data: userProfile
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfil del usuario",
            error: error.message
        });
        //#endregion
    }
};
export const getOtherProfiles = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del perfil que se desea consultar.
        const { idUser } = req.params;

        // (2) - Obtiene el ID del usuario solicitante (logueado).
        const requestUserId = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // (3) - Busca el perfil del usuario objetivo y añade datos básicos del propietario.
        const profile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username email role isVerified")
        //#endregion

        //#region - | VERIFICATIONS |
        // (4) - Verifica que el perfil exista.
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Perfil no encontrado"
            });
        }

        // (5) - Si el perfil es privado y el solicitante no es el dueño → bloquea el acceso.
        if (!profile.visible && requestUserId !== idUser) {
            return res.status(403).json({
                success: false,
                message: "Este perfil es privado"
            });
        }
        //#endregion

        //#region - | RESULT        |
        // (6) - Retorna el perfil ajeno correctamente.
        return res.status(200).json({
            success: true,
            message: "Perfil ajeno obtenido correctamente",
            data: profile
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: "Error al obtener perfil ajeno",
            error: error.message
        });
        //#endregion
    }
};
export const updateProfile = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del usuario autenticado
        const idUser = req.user.id;

        // (2) - Extrae los campos enviados en la solicitud
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
            visible,

        } = req.body;
        //#endregion
        
        //#region - | VERIFICATIONS |
        // (3) - No se requieren validaciones previas en esta versión del handler
        //#endregion
        
        //#region - | PROCESS       |
        // (4) - Función interna para normalizar valores que pueden venir como texto o array
        const normalizeArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            return value.split(",").map(v => v.trim()).filter(Boolean);
        };

        // (5) - Construye objeto con los datos a actualizar
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

        // (6) - Elimina campos no enviados del objeto de actualización
        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        // (7) - Verifica que exista el perfil del usuario
        const existing = await Profile.findOne({ idUser });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Perfil no encontrado"
            });
        }

        // (8) - Si hay archivos enviados, procesa la subida a Cloudinary
        if (req.files) {

            // (9) - Subida y registro de la foto de perfil
            if (req.files.photo?.[0]) {
                const uploadResult = await cloudinary.uploader.upload(
                    req.files.photo[0].path,
                    {
                        folder: "profile_photos",
                        resource_type: "image"
                    }
                );
                updateData.photo = uploadResult.secure_url;

                // (10) - Elimina el archivo temporal
                fs.unlinkSync(req.files.photo[0].path);
            }

            // (11) - Subida y registro del Curriculum Vitae
            if (req.files.curriculumvitae?.[0]) {

                const originalName = req.files.curriculumvitae[0].originalname;
                const extension = originalName.split('.').pop();

                const uploadResult = await cloudinary.uploader.upload(
                    req.files.curriculumvitae[0].path,
                    {
                        folder: "profile_cvs",
                        resource_type: "raw",
                        public_id: `${Date.now()}_${idUser}.${extension}`,
                        access_mode: "public"
                    }
                );


                updateData.curriculumvitae = uploadResult.secure_url;

                // (12) - Elimina el archivo temporal
                fs.unlinkSync(req.files.curriculumvitae[0].path);
            }
        }

        // (13) - Actualiza el perfil del usuario con los datos procesados
        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser },
            updateData,
            { new: true, runValidators: true }
        );

        // (14) - Otorga un logro al usuario por actualizar su perfil
        await grantAchievement(idUser, "APRENDIENDO_MODULO_PERFIL");
        //#endregion
        
        //#region - | RESULT        |
        // (15) - Retorna respuesta exitosa con el perfil actualizado
        return res.status(200).json({
            success: true,
            message: "Perfil actualizado correctamente",
            data: updatedProfile
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error("Error en [updateProfile]:", error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el perfil",
            error: error.message
        });
        //#endregion
    }
};

//* [HELPER ACTIONS]
const upload = multer({ dest: "tmp/" });
export const uploadProfileFiles = upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "curriculumvitae", maxCount: 1 }
]);