import Achievement from "../models/achievement.js";
import User from "../models/user.js";
import UserRewarded from "../models/userRewarded.js";

/** [ ACHIEVEMENT HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION
 *  -------------------------------------------------------------------------
 *  getUserAchievements()   | Obtiene todos los logros alcanzados por un usuario
 *                          | específico, incluyendo detalles del logro y fecha
 *                          | de obtención. Los retorna en orden descendente.
 *  -------------------------------------------------------------------------
 *  getGlobalAchievements() | Obtiene estadísticas globales de todos los logros
 *                          | del sistema, incluyendo cuántos usuarios obtuvieron
 *                          | cada logro y el porcentaje relativo al total.
 *  -------------------------------------------------------------------------
 *  createAchievement()     | Crea un nuevo logro en la plataforma validando que
 *                          | los datos requeridos estén completos antes de
 *                          | registrarlo en la base de datos.
 *  -------------------------------------------------------------------------
 *  deleteAchievement()     | Elimina un logro existente según su ID, validando
 *                          | primero que dicho logro exista.
 *  -------------------------------------------------------------------------
 */


//* [HANDLER ACTIONS]
export const getUserAchievements = async (req, res) => {
    try {
        // (1) - Se solicita el 'idUser', del usuario.
        const { idUser } = req.params;

        // (2) - Valida si el usuario existe.
        const userExists = await User.findById(idUser);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        };

        // (3) - Consulta los logrtos del usuario.
        const userAchievementsToGet = await UserRewarded.find({ idUser })
            .populate("idAchievement")
            .sort({ createdAt: -1 });

        // (4) - Retorna un estado y mensaje de exito. Ademas, de los datos relacionados.
        return res.status(200).json({
            success: true,
            message: `Tienes un total de '${userAchievementsToGet.length}' logros.`,
            data: userAchievementsToGet
        });

    } catch (error) {
        console.error('Error en el handler [getUserAchievements]: ' + error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los logros de un usuario.',
            error: error.message
        });
    };
};
export const getGlobalAchievements = async (req, res) => {
    try {
        // (1) - Obtiene la cantidad de usuarios totales.
        const totalUsers = await UserRewarded.distinct("idUser").then(
            (users) => users.length
        );

        // (2) - Busca y filtra los registros de logros y a los usuarios que obtuvieron esos logros.
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

        // (3) - Procesa los resultados.
        const result = achievements.map((ach) => ({
            ...ach,
            percentage:
                totalUsers === 0
                    ? 0
                    : Number(((ach.totalUsersGotIt / totalUsers) * 100).toFixed(2)),
        }));

        // (4) - Retorna un estado y mensaje de exito. Ademas, de los datos relacionados.
        return res.status(200).json({
            success: true,
            message: 'De todos los usuarios (' + totalUsers + ').',
            achievements: result,
        });
    } catch (error) {
        console.error('Error en el handler [getGlobalAchievements]: ' + error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas globales.',
            error: error.message
        });
    };
};
export const createAchievement = async (req, res) => {
    try {
        /* [PARAMS]_________________________________________________________________ */
        const { code, name, description, icon, points } = req.body;
        /* [VALIDATIONS]____________________________________________________________ */
        if (!code || !name || !description || !icon || !points) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos deben ser llenados.',
            });
        };
        /* [PROCESS]________________________________________________________________ */
        const achievementToCreate = await Achievement.create({
            code,
            name,
            description,
            icon,
            points
        });
        /* [RESULT]_________________________________________________________________ */
        return res.status(201).json({
            success: true,
            message: 'Logro creado correctamente.',
            data: achievementToCreate
        });
    } catch (error) {
        console.error('Error en el handler [createAchievement]: ' + error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear el nuevo logro.',
            error: error.message
        });
    };
};
export const deleteAchievement = async (req, res) => {
    try {
        /* [PARAMS]_________________________________________________________________ */
        const { idAchievement } = req.params;
        /* [VALIDATIONS]____________________________________________________________ */
        const achievementToDelete = await Achievement.findById(idAchievement);
        if (!achievementToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Logro no encontrado.',
            });
        };
        /* [PROCESS]________________________________________________________________ */
        await Achievement.findByIdAndDelete(idAchievement);
        /* [RESULT]_________________________________________________________________ */
        return res.status(200).json({
            success: true,
            message: `El logro '${achievementToDelete.name}' fue eliminado correctamente.`,
        });
    } catch (error) {
        console.error('Error en el handler [deleteAchievement]: ' + error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el logro.',
            error: error.message
        });
    };
};