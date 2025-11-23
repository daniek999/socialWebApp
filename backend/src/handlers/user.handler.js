import User from "../models/user.js";
import Post from '../models/post.js';
import Profile from "../models/profile.js";

/**
 * ----------------
 * [ USER HANDLER ]
 * ----------------
 */

// [GET] Obtener todos los usuarios (Admin)
export const getUsers = async (req, res) => {
    try {
        //#region [ Process ]
        const users = await User.find();
        //#endregion

        //#region [ Result ]
        return res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos correctamente.',
            data: users,
        });
        //#endregion

    } catch (error) {
        //#region [ Error ]
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios.',
            error: error.message,
        });
        //#endregion
    }
};
// [GET] Obtener usuario propio (Admin)
export const getSelfUser = async (req, res) => {
    try {
        //#region [ Params ]
        const idUser = req.user.id;
        //#endregion

        //#region [ Process ]
        const userData = await User.findById(idUser);
        //#endregion

        //#region [ Verifications ]
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }
        //#endregion

        //#region [ Result ]
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });
        //#endregion

    } catch (error) {
        //#region [ Error ]
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario autenticado.',
            error: error.message,
        });
        //#endregion
    }
};
// [GET] Obtener usuario diferente (Admin)
export const getOtherUsers = async (req, res) => {
    try {
        //#region [ Params ]
        const { idUser } = req.params;
        //#endregion

        //#region [ Process ]
        const userData = await User.findById(idUser);
        //#endregion

        //#region [ Verifications ]
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }
        //#endregion

        //#region [ Result ]
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });
        //#endregion

    } catch (error) {
        //#region [ Error ]
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario.',
            error: error.message,
        });
        //#endregion
    }
};
// [DELETE] Eliminar usuario por ID (Admin)
export const deleteUser = async (req, res) => {
    try {
        //#region [ Params ]
        const { idUser } = req.params;
        //#endregion

        //#region [ Process ]
        const userToDelete = await User.findById(idUser);
        //#endregion

        //#region [ Verifications ]
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }
        //#endregion

        //#region [ Process - related data ]
        await Promise.all([
            Post.deleteMany({ idUser }),
            Profile.deleteOne({ idUser }),
        ]);

        await User.findByIdAndDelete(idUser);
        //#endregion

        //#region [ Result ]
        res.status(200).json({
            success: true,
            message: `El usuario "${userToDelete.username}" y sus datos relacionados fueron eliminados correctamente.`,
        });
        //#endregion

    } catch (error) {
        //#region [ Error ]
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario.',
            error: error.message,
        });
        //#endregion
    }
};
