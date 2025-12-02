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
        // (1) - Busca a todos los usuarios suspendidos. 
        const suspendedUsers = await UserSuspended.find()
            .populate("idUser", "username")
            .populate("suspendedBy", "username")
            .populate("revokedBy", "username")

        // (2) - Retorna un estado y mensaje de exito y los datos de usuarios suspendidos
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
        // (1) - Busca a todos los usuarios baneados. 
        const bannedUsers = await UserBanned.find()
            .populate("idUser", "username")
            .populate("bannedBy", "username")
            .populate("revokedBy", "username");

        // (2) - Retorna un estado y mensaje de exito y los datos de usuarios baneados.
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
        //#region [ PARAMS ]
        const { idUser } = req.params;
        const { reason, suspendedTime } = req.body;
        const idAdmin = req.user.id;
        //#endregion
        
        //#region [ VALIDATIONS ]
        // (1) - Validar campos requeridos.
        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: 'La razón de la suspensión es obligatoria.',
            });
        };
        // (2) -  Validar duración
        // const validDurations = [1, 5, 10];
        // if (!validDurations.includes(suspendedTime)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Duración inválida. Opciones: 1, 5 o 10 minutos. Usted ingreso: ' + suspendedTime,
        //     });
        // };
        // (3) -  Verifica que el usuario exista.
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        };
        // (4) -  No permitir suspender admins
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No se puede suspender a un administrador.',
            });
        }
        // (5) -  Verifica que el usuario no se encuentre ya suspendido.
        if (user.status === "Suspendido") {
            return res.status(404).json({ 
                message: 'El usuario ' + user.username + ' ya se encuentra en una suspension.'  
            });
        };
        // (6) -  Verificar si está baneado
        if (user.status === 'Baneado') {
            return res.status(409).json({
                success: false,
                message: 'El usuario ' + user.username + ' está baneado permanentemente.',
            });
        }
        //#endregion
        
        //#region [ PROCESS ]
        // (1) - Capta la fecha de la suspension y la fecha de reanudación.
        const now = new Date();
        const until = new Date(now.getTime() + suspendedTime * 60000);

        // (2) - Registrar la suspensión
        await UserSuspended.create({
            idUser,
            reason,
            suspendedBy: idAdmin,
            suspendedTime,
            suspendedAt: now,
            suspendedUntil: until
        });

        // (3) - Actualizar estado del usuario
        user.status = 'Suspendido';
        await user.save();

        // (4) - Ocultar perfil durante suspensión
        await Profile.findOneAndUpdate(
            { idUser },
            { visible: false }
        );

        // (5) - Enviar email al usuario (implementar después)
        /* try {
            await sendSuspensionEmail(
                user.email,
                user.username,
                reason,
                suspendedUntil,
                suspendedTime
            );
        } catch (emailError) {
            console.error('Error enviando email:', emailError);
        } */
        //#endregion
        
        //#region [ RESULT ]
        return res.status(200).json({
            success: true,
            message: `El usuario "${user.username}" ha sido suspendido por ${suspendedTime} minuto(s).`,
        });
        //#endregion
    
    } catch (error) {
        //#region [ ERROR ]
        return res.status(500).json({
            success: false,
            message: 'Error al suspender usuario.',
            error: error.message,
        });
        //#endregion
    };
};
export const revokeSuspension = async (req, res) => {
    try {
        //#region [ PARAMS ]
        const { idUser } = req.params;
        const { revokeReason } = req.body;
        //#endregion
        
        //#region [ VALIDATIONS ]
        // (1) - Busca la suspensión activa.
        const suspension = await UserSuspended.findOne({
            idUser,
            status: 'Activo'
        });
        // (2) - Si el no encuentra.
        if (!suspension) {
            return res.status(404).json({ 
                success: false,
                message: 'El usuario no presenta una suspension activa. Es probable que haya expirado o haya sido revocado.' 
            });
        }
        //#endregion
        
        //#region [ PROCESS ]
        // (1) - Registra la revocacion del usuario suspendido.
        suspension.status = 'Revocado';
        suspension.revokedAt = new Date();
        suspension.revokedBy = req.user.id;
        suspension.revokeReason = revokeReason;
        await suspension.save();

        // (2) - Reactiva al usuario.
        await User.findByIdAndUpdate(idUser, { status: 'Activo' });
        //#endregion
        
        //#region [ RESULT ]
        return res.status(200).json({
            success: true,
            message: `La suspensión ha sido revocada.`,
        });
        //#endregion
    
    } catch (error) {
        //#region [ ERROR ]
        //#endregion
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
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al revocar el baneo.',
            error: error.message
        });
    };
};