import User from "../models/user.js";
import Post from '../models/post.js';
import Profile from "../models/profile.js";

/* ----- [ USER HANDLER] ----- */

// [GET] Obtener todos los usuarios (Admin)
export const getUsers = async (req, res) => {
    try {
        // Process
        const users = await User.find();

        // Result
        return res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos correctamente.',
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los usuarios.',
            error: error.message,
        });
    }
};

// [GET] Obtener usuario propio (Admin)
export const getSelfUser = async (req, res) => {
    try {
        // Params from Payload
        const idUser = req.user.id;

        // Process
        const userData = await User.findById(idUser);

        // Verifications
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }

        // Result
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario autenticado.',
            error: error.message,
        });
    }
};

// [GET] Obtener usuario diferente (Admin)
export const getOtherUsers = async (req, res) => {
    try {
        // Params
        const { idUser } = req.params;

        // Process
        const userData = await User.findById(idUser);

        // Verifications
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }

        // Result
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario.',
            error: error.message,
        });
    }
};

// [DELETE] Eliminar usuario por ID (Admin)
export const deleteUser = async (req, res) => {
    try {
        // Params
        const { idUser } = req.params;

        // Process
        const userToDelete = await User.findById(idUser);
        
        // Verifications
        if (!userToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }
        await Promise.all([
            Post.deleteMany({ idUser: idUser }),
            Profile.deleteOne({ idUser: idUser }),
        ]);
        await User.findByIdAndDelete(idUser);

        // Result
        res.status(200).json({
            success: true,
            message: `El usuario "${userToDelete.username}" y sus datos relacionados fueron eliminados correctamente.`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario.',
            error: error.message,
        });
    }
};
