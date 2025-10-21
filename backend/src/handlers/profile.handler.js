import Profile from '../models/profile.js';

// MARK: [GET] getAllProfiles
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

// MARK: [GET] getAllProfiles
export const getVisibleProfiles = async (req, res) => {
    try {
        // Process
        const visibleUserProfiles = await Profile
            .find({visible: true})
            .populate("idUser", "username")

        // Result
        res.status(200).json(visibleUserProfiles);
    } catch (error) {
        res.status(500).json({ message: "Error al Obtener Perfiles Publicos -> " + error  })
    }
};

// MARK: [GET] getProfileByIdUser
export const getProfileByIdUser = async (req, res) => {
    try {
        // Params
        const idUser = req.user.id
        const username = req.user.username
        
        // Process 
        const userProfile = await Profile
            .findOne({ idUser })
            .populate("idUser", "username");

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

// MARK: [PUT] editProfile
export const editProfile = async (req, res) => {
    try {
        // Params
        const { name, surname, profession, interests, hobbies, visible } = req.body;

        // Process
        const updatedProfile = await Profile.findOneAndUpdate(
            { idUser: req.user.id },
            { name, surname, profession, interests, hobbies, visible },
            { new: true, runValidators: true }
        );

        // Verifications
        if (!updatedProfile) {
            return res.status(404).json({ message: "Perfil no encontrado" });
        }

        // Result
        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al editar el perfil" });
    }
};
