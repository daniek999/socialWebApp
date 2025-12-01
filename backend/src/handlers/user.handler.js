import User from '../models/user.js';
import UserBanned from '../models/userBanned.js';
import UserSuspended from '../models/userSuspended.js';
import Profile from '../models/profile.js';
import Friendship from '../models/friendship.js';
import Post from '../models/post.js';
import UserRewarded from '../models/userRewarded.js';

/** [ USER HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                           
 *  -------------------------------------------------------------------------
 *  getUsers()              | Obtiene todos los usuarios del sistema.
 *  getSelfUser()           | Obtiene la información del usuario autenticado.
 *  getSuspendedUsers()     | Obtiene la lista de usuarios actualmente suspendidos.
 *  getBannedUsers()        | Obtiene la lista de usuarios baneados.
 *  getOtherUsers()         | Obtiene la información pública de otro usuario.
 *  suspendUser()           | Suspende temporalmente a un usuario y registra el evento.
 *  revokeSuspension()      | Revoca una suspensión activa y reactiva al usuario.
 *  banUser()               | Banea permanentemente a un usuario y registra el baneo.
 *  revokeBan()             | Revoca un baneo activo y reactiva al usuario.
 */



//* [HANDLER ACTIONS]
export const getUsers = async (req, res) => {
    try {
        // (3) - Busca a todos los usuarios. 
        const users = await User.find();

        // (4) - Retorna un estado y mensaje de exito y la informacion de los usuarios
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
export const getSelfUser = async (req, res) => {
    try {
        // (1) - Se utiliza el 'idUser' del payload.
        const idUser = req.user.id;

        // (3) - Busca al usuario.
        const userData = await User.findById(idUser);

        // (2) - Valida que el usuario exista.
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        }

        // (4) - Retorna un estado y mensaje de exito. Ademas de enviar la data de este usuario.
        res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });

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
export const getSuspendedUsers = async (req, res) => {
    try {
        // (3) - Busca a todos los usuarios suspendidos. 
        const suspendedUsers = await UserSuspended.find();

        // (4) - Retorna un estado y mensaje de exito y los datos de usuarios suspendidos
        return res.status(200).json({
            success: true,
            message: 'Se ha cargado la lista de los usuarios suspendidos correctamente.',
            data: suspendedUsers,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'No se ha podido cargar la lista de los usuarios suspendidos correctamente.',
            error: error.message,
        });
    }  
};
export const getBannedUsers = async (req, res) => {
    try {
        // (3) - Busca a todos los usuarios baneados. 
        const bannedUsers = await UserBanned.find();

        // (4) - Retorna un estado y mensaje de exito y los datos de usuarios baneados.
        return res.status(200).json({
            success: true,
            message: 'Se ha cargado la lista de los usuarios baneados correctamente.',
            data: bannedUsers,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'No se ha podido cargar la lista de los usuarios baneados correctamente.',
            error: error.message,
        });
    }  
};
export const getOtherUsers = async (req, res) => {
    try {
        // (1) - Se envia el 'idUser' del usuario al cual buscar.
        const { idUser } = req.params;

        // (3) - Busca al usuario
        const userData = await User.findById(idUser)
            .select('-password');;

        // (2) - Valida que el usuario exista.
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.',
            });
        };

        // (4) - Retorna un estado y mensaje de exito y la informacion del usuario a buscar
        return res.status(200).json({
            success: true,
            message: 'Usuario obtenido correctamente.',
            data: userData,
        });

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
export const suspendUser = async (req, res) => {
    try {
        // (1) - Se requiere de idUser, razon y tiempo de suspension (minutos).
        const { idUser } = req.params;
        const { reason, suspendedTime } = req.body;

        // (2) - Verifica que el usuario exista.
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        };
        // (2) - Verifica que el usuario no se encuentre ya suspendido.
        if (user.status === "Suspendido") {
            return res.status(404).json({ 
                message: 'El usuario ' + user.username + ' ya se encuentra en una suspension.'  
            });
        };

        // (3) - Capta la fecha de la suspension y la fecha de reanudación.
        const now = new Date();
        const until = new Date(now.getTime() + suspendedTime * 60000);
        // (3) - Registra la accion en 'UserSuspended'
        await UserSuspended.create({
            idUser,
            reason,
            suspendedBy: req.user.id,
            suspendedTime,
            suspendedAt: now,
            suspendedUntil: until
        });
        // (3) - Cambia el estado del usuario a 'Suspendido'.
        user.status = 'Suspendido';
        await user.save();

        // (4) - Retorna un mensaje de exito y la fecha de reanudación.
        return res.status(200).json({
            success: true,
            message: 'El usuario (' + user.username + ') ha sido suspendido durante ' + suspendedTime + ' minutos.',
            data: UserSuspended
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al suspender usuario.',
            error: error.message,
        });
    };
};
export const revokeSuspension = async (req, res) => {
    try {
        // (1) - Se envia el 'idSuspension' del registro de la suspension y la 'reason' de esta revocacion.
        const { idSuspension } = req.params;
        const { reason } = req.body;

        // (2) - Verifica que la suspension exista.
        const suspension = await UserSuspended.findById(idSuspension);
        if (!suspension) {
            return res.status(404).json({ 
                success: false,
                message: 'Suspensión no encontrada' 
            });
        };

        // (3) - Actualiza el registro de [userSuspended].
        suspension.status = 'Revocado';
        suspension.revokedAt = new Date();
        suspension.revokedBy = req.user._id;
        suspension.revokeReason = reason;
        await suspension.save();

        // (3) - Se reactiva al usuario.
        await User.findByIdAndUpdate(suspension.idUser, { status: 'Activo' });

        // (4) - Retorna un estado y mensaje de exito.
        return res.status(200).json({
            success: true,
            message: `La suspensión ha sido revocada.`,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al revocar suspensión.',
            error: error.message,
        });
    };
};
export const banUser = async (req, res) => {
    try {
        // (1) - Recoge parametros del request.
        const { idUser } = req.params;
        const { reason } = req.body;
        const bannedBy = req.user.id; // Admin logueado

        // (2) - Verifica que exista el usuario.
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        };
        // (2) - Verifica que el usuario no esté ya baneado.
        if (user.status === 'Baneado') {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya está baneado.'
            });
        };
        // (2) - Verifica que venga la razón del baneo.
        if (!reason || reason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar una razón del baneo.'
            });
        };

        // (3) - Marca el usuario como Baneado.
        user.status = 'Baneado';
        await user.save();
        // (3) - Crea registro en UserBanned.
        const banRecord = new UserBanned({
            idUser,
            reason,
            bannedBy
        });
        await banRecord.save();

        // (4) - Retorna respuesta.
        return res.status(200).json({
            success: true,
            message: 'Usuario baneado correctamente.',
            banRecord
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al banear al usuario.',
            error: error.message
        });
    };
};
export const revokeBan = async (req, res) => {
    try {
        // (1) - Parametros del request
        const { idUser } = req.params;
        const { revokeReason } = req.body;
        const revokedBy = req.user.id;

        // (2) - Verifica que exista el usuario
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        };
        // (2) - Valida que el usuario esté baneado
        if (user.status !== 'Baneado') {
            return res.status(400).json({
                success: false,
                message: 'El usuario no está baneado actualmente.'
            });
        };
        // (2) - Busca registro activo del baneo
        const banRecord = await UserBanned.findOne({
            idUser,
            status: 'Activo'
        });
        if (!banRecord) {
            return res.status(404).json({
                success: false,
                message: 'No hay un registro activo del baneo.'
            });
        };
        // (2) - Valida razon de revocación
        if (!revokeReason || revokeReason.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar una razón para revocar el baneo.'
            });
        }

        // (3) - Actualiza el usuario a Activo
        user.status = 'Activo';
        await user.save();
        // (3) - Actualiza el registro del baneo
        banRecord.status = 'Revocado';
        banRecord.revokedAt = new Date();
        banRecord.revokedBy = revokedBy;
        banRecord.revokeReason = revokeReason;
        await banRecord.save();

        // (4) - Retorna respuesta
        return res.status(200).json({
            success: true,
            message: 'El baneo ha sido revocado.',
            banRecord
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al revocar el baneo.',
            error: error.message
        });
    };
};