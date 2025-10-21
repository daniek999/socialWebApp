import User from "../models/user.js";
import Post from '../models/Post.js';
import Profile from '../models/Profile.js';


// MARK: [GET] getAllUsers
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error})
    }
}

// MARK: [GET] getUserById
export const getUserById = async (req, res) => {
    try {
        // Param
        const idUser = req.params._id;

        // Function
        const userData = await User.findById( idUser );

        if (!userData) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Response
        res.status(200).json( userData )
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error})
    }
}

// MARK: [DELETE] deleteUser
export const deleteUser = async (req, res) => {
    try {
        // Param
        const idUser = req.params._id

        // Verifications
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Function
        await Promise.all([
            Post.deleteMany({ idUser }),
            Profile.deleteOne({ idUser }),
        ]);

        await User.findByIdAndDelete(idUser);

        // Response
        res.json({ message: "Usuario y datos relacionados eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor -> ' + error.message });
    }
}

// MARK: [PUT] updateUser *stand by*

