import Profile from '../models/profile.js';

// MARK: [POST] createProfile
export const createProfile = async (req, res) => {
    // Testing
    try {
        // Search and verify that exists.
        const exists = await Profile
            .findOne({idUser: req.user.id})
        if (exists) {
            return res.status(400).json({ message: "El perfil ya existe" });
        }

        // If not, create a default profile.
        const newProfile = new Profile({
            idUser: req.user.id,
            name: "",
            surname: "",
            profession: "",
            interests: [],
            hobbies: [],
            visible: true
        });

        // Save profile.
        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ message: "Error al Crear Perfil -> " + error })
    }
};

// MARK: [PUT] editProfile
export const editProfile = async (req, res) => {
    // Testing
    try {
        const { 
            name, 
            surname, 
            profession,
            interests, 
            hobbies, 
            visible 
        } = req.body;

        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser: req.user.id },
            { name, surname, profession, interests, hobbies, visible },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al editar el perfil" });
    }
};

// MARK: [GET] getProfileByIdUser
export const getProfileByIdUser = async (req, res) => {
    // Defyning
    const idUser = req.user.id
    const username = req.user.username
    // Testing
    try {
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username");

        if (!userProfile) {
            return res.status(404).json({ message: "El Usuario '" + username + "' no posee un perfil." });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: "Error al Obtener Perfil del Usuario: " + error });
    }
};

// MARK: [GET] getAllProfiles
export const getAllProfiles = async (req, res) => {
    // Testing
    try {
        const visibleUserProfiles = await Profile
            .find({visible: true})
            .populate("idUser", "username")

        res.status(200).json(visibleUserProfiles);
    } catch (error) {
        res.status(500).json({ message: "Error al Obtener Perfiles Publicos -> " + error  })
    }
};