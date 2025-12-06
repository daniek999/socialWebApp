import Achievement from "../models/achievement.js";
import User from "../models/user.js";
import UserRewarded from "../models/userRewarded.js";

/** [ ACHIEVEMENT HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION
 *  -------------------------------------------------------------------------
 *  getUserAchievements()   | Obtiene todos los logros obtenidos de un usuario.
 *  getGlobalAchievements() | Obtiene estadísticas globales de todos los logros del sistema.
 *  createAchievement()     | Crea un nuevo logro.
 *  deleteAchievement()     | Elimina un logro existente según su ID.
 */


//* [HANDLER ACTIONS]
export const getUserAchievements = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del usuario desde los parámetros de la ruta
        const { idUser } = req.params;
        //#endregion

        //#region - | VERIFICATIONS |
        // (2) - Verifica si el usuario existe en la base de datos
        const userExists = await User.findById(idUser);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        };
        //#endregion

        //#region - | PROCESS       |
        // (3) - Obtiene todos los logros del usuario,
        //       incluyendo información del logro relacionado y ordenado por fecha descendente
        const userAchievementsToGet = await UserRewarded.find({ idUser })
            .populate("idAchievement")
            .sort({ createdAt: -1 });
        //#endregion

        //#region - | RESULT        |
        // (4) - Retorna los logros del usuario junto con un mensaje de éxito
        return res.status(200).json({
            success: true,
            message: `Tienes un total de '${userAchievementsToGet.length}' logros.`,
            data: userAchievementsToGet
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los logros de un usuario.',
            error: error.message
        });
        //#endregion
    };
};
export const getGlobalAchievements = async (req, res) => {
    try {
        //#region - | PROCESS       |
        // (1) - Obtiene la cantidad total de usuarios únicos que han recibido al menos un logro
        const totalUsers = await UserRewarded.distinct("idUser").then(
            (users) => users.length
        );

        // (2) - Obtiene todos los logros junto con la cantidad de usuarios que obtuvo cada uno
        const achievements = await Achievement.aggregate([
            {
                $lookup: {
                    from: "userrewardeds",
                    localField: "_id",
                    foreignField: "idAchievement",
                    as: "logs",
                },
            },
            {
                $project: {
                    code: 1,
                    name: 1,
                    description: 1,
                    icon: 1,
                    points: 1,
                    totalUsersGotIt: { $size: "$logs" },
                },
            },
        ]);

        // (3) - Calcula el porcentaje de usuarios que han obtenido cada logro
        const result = achievements.map((ach) => ({
            ...ach,
            percentage:
                totalUsers === 0
                    ? 0
                    : Number(((ach.totalUsersGotIt / totalUsers) * 100).toFixed(2)),
        }));
        //#endregion

        //#region - | RESULT        |
        // (4) - Retorna los resultados globales con el porcentaje correspondiente
        return res.status(200).json({
            success: true,
            message: 'De todos los usuarios (' + totalUsers + ').',
            achievements: result,
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas globales.',
            error: error.message
        });
        //#endregion
    };
};
export const createAchievement = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene los datos enviados en el cuerpo del request
        const { code, name, description, icon, points } = req.body;
        //#endregion

        //#region - | VALIDATIONS   |
        // (2) - Valida que todos los campos requeridos hayan sido enviados
        if (!code || !name || !description || !icon || !points) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos deben ser llenados.',
            });
        };
        //#endregion

        //#region - | PROCESS       |
        // (3) - Crea un nuevo logro en la base de datos
        const achievementToCreate = await Achievement.create({
            code,
            name,
            description,
            icon,
            points
        });
        //#endregion

        //#region - | RESULT        |
        // (4) - Retorna la respuesta exitosa con el logro creado
        return res.status(201).json({
            success: true,
            message: 'Logro creado correctamente.',
            data: achievementToCreate
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al crear el nuevo logro.',
            error: error.message
        });
        //#endregion
    };
};
export const deleteAchievement = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del logro desde los parámetros del request
        const { idAchievement } = req.params;
        //#endregion

        //#region - | VERIFICATIONS |
        // (2) - Busca el logro por ID para verificar que exista
        const achievementToDelete = await Achievement.findById(idAchievement);
        if (!achievementToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Logro no encontrado.',
            });
        };
        //#endregion

        //#region - | PROCESS       |
        // (3) - Elimina el logro de la base de datos
        await Achievement.findByIdAndDelete(idAchievement);
        //#endregion

        //#region - | RESULT        |
        // (4) - Retorna la respuesta exitosa
        return res.status(200).json({
            success: true,
            message: `El logro '${achievementToDelete.name}' fue eliminado correctamente.`,
        });
        //#endregion

    } catch (error) {
        //#region - | ERROR         |
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el logro.',
            error: error.message
        });
        //#endregion
    };
};