import User from "../models/user.js";
import UserBanned from "../models/userBanned.js";

export const checkBan = async (userId) => {
    // (1) - Verifica que el usuario exista.
    const user = await User.findById(userId);
    if (!user) {
        return {
            success: false,
            error: "Usuario no encontrado"
        };
    };

    // (2) - Si el usuario NO está baneado, se le permite el acceso.
    if (user.status !== 'Baneado') {
        return {
            success: true,
            isBanned: false
        };
    };

    // (3) - Busca el último registro de baneo.
    const banRecord = await UserBanned
        .findOne({ idUser: userId })
        .sort({ createdAt: -1 });

    // (4) - Verifica que exista el registro.
    if (!banRecord) {
        return {
            success: false,
            error: "Usuario baneado sin registro válido"
        };
    };

    // (5) - Si el baneo fue revocado.
    if (banRecord.status === "Revocado") {
        // (A) - Sincroniza con el estado del usuario.
        if (user.status === 'Baneado') {
            user.status = "Activo";
            await user.save();
        }
        // (B) - Retorna respuesta
        return {
            success: true,
            isBanned: false,
            revokedAt: banRecord.revokedAt,
            revokedBy: banRecord.revokedBy
        };
    };

    // (6) - Si el baneo sigue activo → acceso denegado
    return {
        success: true,
        isBanned: true,
        reason: banRecord.reason,
        bannedBy: banRecord.bannedBy,
        banRecordId: banRecord._id
    };
};