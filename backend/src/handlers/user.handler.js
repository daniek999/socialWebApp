import User from "../models/user.js";
import Post from '../models/post.js';
import Profile from "../models/profile.js";
import Friendship from "../models/friendship.js";

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
        const userData = await User.findById(idUser).select('-password');;
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
        //console.log(userData);
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

        //#region [ Verifications ]
        const userToDelete = await User.findById(idUser);
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
            Friendship.deleteMany({
                $or: [
                    { requester: idUser },
                    { recipient: idUser }
                ]
            })
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
/** [PATCH] Desactivar usuario por ID (Admin)
 * 
 */
export const deactivateUser = async (req, res) => {
    try {
        //#region [ Params ]
        const { idUser } = req.params;
        //#endregion

        //#region [ Verifications ]
        const userToDeactivate = await User.findById(idUser);
        if (!userToDeactivate) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }
        //#endregion

        //#region [ Process ]
        // Desactiva la cuenta.
        userToDeactivate.state = !userToDeactivate.state;
        await userToDeactivate.save();
        // Deja el perfil en privado.
        if (!userToDeactivate.state) {
            await Profile.findOneAndUpdate(
                { idUser },
                { visible: false },
                { new: true }
            );
        }
        //#endregion

        //#region [ Result ]
        res.status(200).json({
            success: true,
            message: `El estado del usuario [${userToDeactivate.username}] ha cambiado.`,
            // data: {
            //     _id: userToDeactivate._id,
            //     username: userToDeactivate.username,
            //     state: userToDeactivate.state,
            // },
        });
        //#endregion
        
    } catch (error) {
        //#region [ Error ]
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado del usuario.',
            error: error.message,
        });
        //#endregion
    }
};
