import User from "../models/user.js";
import UserSuspended from "../models/userSuspended.js";

export const checkSuspension = async (userId) => {
    // (1) - Verifica que el usuario exista
    const user = await User
        .findById(userId);
    if (!user) return { 
        success: false, 
        error: 'Usuario no encontrado' 
    };

    // (2) - Verifica el estado del usuario
    if (user.status !== 'Suspendido') {
        return { 
            success: true, 
            suspended: false 
        };
    };

    // (3) - Busca y obtiene el ultimo registro de suspension del usuario que inicia sesion.
    const suspended = await UserSuspended
        .findOne({ idUser: userId })
        .sort({ suspendedAt: -1 });

    // (4) - Verifica que exista el registro.
    if (!suspended) {
        return { 
            success: false, 
            error: 'Usuario suspendido sin registro válido' 
        };
    };

    // (5) - Obtiene la fecha actual y la fecha de renaudacion.
    const now = new Date();
    const end = new Date(suspended.suspendedUntil);

    // (5) - Si la suspension expiro naturalmente.
    if (now >= end) {
        suspended.status = "Expirada";
        await suspended.save();
        user.status = "Activo";
        await user.save();
        return { 
            success: true, 
            isSuspended: false, 
        };
    };

    // (6) - Si la suspension sigue activa.
    return {
        success: true,
        isSuspended: true,
        suspendedUntil: suspended.suspendedUntil
    };
};