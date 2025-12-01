import Achievement from "../models/achievement.js";
import UserRewarded from "../models/userRewarded.js";

export const grantAchievement = async (idUser, code) => {
    try {
        // (3) - Buscar el logro (achievement) por su código único.
        const achievement = await Achievement.findOne({ code });
        if (!achievement) return null;

        // (2) - Evitar duplicar logros.
        const exists = await UserRewarded.findOne({
            idUser,
            idAchievement: achievement._id
        });

        // (1) Crea un parametro para la asignacion del logro.
        if (exists) return { assigned: false };
        const log = await UserRewarded.create({
            idUser,
            idAchievement: achievement._id,
        });
        return { assigned: true, log };

    } catch (error) {
        console.error("Error asignando logro:", error);
        return null;
    };
};
