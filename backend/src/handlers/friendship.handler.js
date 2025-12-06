import Friendship from "../models/friendship.js";
import User from '../models/user.js';
import Profile from '../models/profile.js';
import mongoose from 'mongoose';

/** [ FRIENDSHIP HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                          
 *  -------------------------------------------------------------------------
 *  sendFriendRequest()     | Envia una solicitud de amistad a otros usuario.
 *  acceptFriendRequest()   | Acepta una solicitud enviada por otros usuarios.
 *  rejectFriendRequest()   | Rechaza la solicitud enviada por otros usuarios.
 *  cancelFriendRequest()   | Cancela la solicitud enviada a otros usuarios.
 *  removeFriend()          | Elimina a un amigo ya aceptado.
 *  getFriends()            | Lista a todos tus amigos marcados como 'Aceptado'.
 *  getPendingRequests()    | Lista todos las solicitudes pendientes de otros usuarios.
 *  getSentRequests()       | Lista todos las solicitudes enviadas a otros usuarios.
 *  getRelationshipStatus() | Obtiene el estado de la relacion con otros usuarios.
 */


//* [HANDLER ACTIONS]
export const sendFriendRequest = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { recipientId } = req.body;
        const requesterId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (1) - ID del destinatario es requerido.
        if (!recipientId) {
            return res.status(400).json({ 
                message: 'El ID del usuario destinatario es requerido' 
            });
        }

        // (2) - Validar formato del ObjectId
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ 
                message: 'ID de usuario inválido' 
            });
        }

        // (3) - Evitar enviarse solicitud a sí mismo
        if (requesterId === recipientId) {
            return res.status(400).json({ 
                message: 'No puedes enviarte una solicitud a ti mismo' 
            });
        }

        // (4) - Verificar que el destinatario exista
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }

        // (5) - Evitar solicitudes duplicadas en AMBAS direcciones
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingFriendship) {
            // Ya existe solicitud pendiente
            if (existingFriendship.status === 'Pendiente') {
                if (existingFriendship.requester.toString() === requesterId) {
                    return res.status(409).json({ 
                        message: 'Ya enviaste una solicitud a este usuario.' 
                    });
                } else {
                    return res.status(409).json({ 
                        message: 'Este usuario ya te envió una solicitud. Revisa tus pendientes.' 
                    });
                }
            }

            // Ya son amigos
            if (existingFriendship.status === 'Aceptado') {
                return res.status(409).json({ 
                    message: 'Ya son amigos.' 
                });
            }

            // Si fue rechazada → se elimina para permitir reenviar
            if (existingFriendship.status === 'Rechazado') {
                await Friendship.findByIdAndDelete(existingFriendship._id);
            }
        }
        //#endregion

        //#region - | PROCESS       |
        const friendship = await Friendship.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'Pendiente'
        });

        await friendship.populate('recipient', 'username email');
        //#endregion

        //#region - | RESULT        |
        return res.status(201).json({
            message: 'Solicitud de amistad enviada correctamente',
            friendship
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [sendFriendRequest]: ' + error);

        if (error.code === 11000) {
            return res.status(409).json({ 
                message: 'Ya existe una solicitud a este usuario' 
            });
        }

        return res.status(500).json({ 
            message: 'Error al enviar solicitud de amistad',
            error: error.message 
        });
        //#endregion
    };
};
export const acceptFriendRequest = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (1) - Solicitud debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }

        // (2) - Solo el destinatario puede aceptar
        if (friendshipSolicitude.recipient.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permiso para aceptar esta solicitud'
            });
        }

        // (3) - Debe estar pendiente
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(400).json({
                message: `Esta solicitud ya fue ${friendshipSolicitude.status === 'Aceptado' ? 'Aceptada' : 'Rechazada'}`
            });
        }
        //#endregion

        //#region - | PROCESS       |
        friendshipSolicitude.status = 'Aceptado';
        await friendshipSolicitude.save();

        await friendshipSolicitude.populate([
            { path: 'requester', select: 'username email' },
            { path: 'recipient', select: 'username email' }
        ]);
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            message: 'Solicitud aceptada correctamente.',
            friendship: friendshipSolicitude
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [acceptFriendRequest]: ' + error);
        return res.status(500).json({
            message: 'Error al aceptar la solicitud de amistad.',
            error: error.message
        });
        //#endregion
    };
};
export const rejectFriendRequest = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (1) - Solicitud debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }

        // (2) - Solo el destinatario puede rechazar
        if (friendshipSolicitude.recipient.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permisos sobre esta solicitud.'
            });
        }

        // (3) - Debe estar pendiente
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(400).json({
                message: 'Esta solicitud ya fue procesada.'
            });
        }
        //#endregion

        //#region - | PROCESS       |
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            message: 'Solicitud rechazada correctamente.'
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [rejectFriendRequest]: ' + error);

        return res.status(500).json({
            message: 'Error al rechazar la solicitud de amistad.',
            error: error.message
        });
        //#endregion
    };
};
export const cancelFriendRequest = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (1) - Solicitud debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }

        // (2) - Solo el emisor puede cancelar
        if (friendshipSolicitude.requester.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permiso para cancelar esta solicitud'
            });
        }

        // (3) - Solo se cancelan solicitudes pendientes
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(403).json({
                message: 'Solo puedes cancelar solicitudes pendientes'
            });
        }
        //#endregion

        //#region - | PROCESS       |
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            message: 'Solicitud cancelada correctamente.'
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [cancelFriendRequest]: ' + error);

        return res.status(500).json({
            message: 'Error al cancelar la solicitud de amistad.',
            error: error.message
        });
        //#endregion
    };
};
export const removeFriend = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (1) - La relación debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Amistad no encontrada.'
            });
        }

        // (2) - El usuario debe ser parte de la amistad
        const isRequester = friendshipSolicitude.requester.toString() === userId;
        const isRecipient = friendshipSolicitude.recipient.toString() === userId;

        if (!isRequester && !isRecipient) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta amistad.'
            });
        }

        // (3) - Debe ser un vínculo confirmado
        if (friendshipSolicitude.status !== 'Aceptado') {
            return res.status(400).json({
                message: 'Solo puedes eliminar amistades confirmadas.'
            });
        }
        //#endregion

        //#region - | PROCESS       |
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            message: 'Amistad eliminada correctamente.'
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [removeFriend]: ' + error);

        return res.status(500).json({
            message: 'Error al eliminar amistad.',
            error: error.message
        });
        //#endregion
    };
};
export const getFriends = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const userId = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // (1) - Obtener todas las amistades confirmadas
        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'Aceptado' },
                { recipient: userId, status: 'Aceptado' }
            ]
        })
            .populate('requester', 'username email')
            .populate('recipient', 'username email')
            .sort({ updatedAt: -1 });

        // (2) - Transformar datos a un formato limpio
        const friends = await Promise.all(
            friendships.map(async (friendship) => {
                // Determinar quién es el otro usuario
                const friendUser =
                    friendship.requester._id.toString() === userId
                        ? friendship.recipient
                        : friendship.requester;

                // Obtener perfil del amigo (si existe)
                const profile = await Profile.findOne({ idUser: friendUser._id })
                    .select('name surname situation description profession photo');

                return {
                    friendshipId: friendship._id,
                    user: {
                        id: friendUser._id,
                        username: friendUser.username,
                        email: friendUser.email
                    },
                    profile: profile || null,
                    since: friendship.updatedAt
                };
            })
        );
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            count: friends.length,
            friends
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [getFriends]: ' + error);

        return res.status(500).json({
            message: 'Error al obtener listado de amistades.',
            error: error.message
        });
        //#endregion
    };
};
export const getPendingRequests = async (req, res) => {
    try {
        //#region - | PARAMS        |
        const userId = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // 1. Busca solicitudes donde el usuario actual es el receptor.
        const requests = await Friendship.find({
            recipient: userId,
            status: 'Pendiente'
        })
            .populate('requester', 'username email') // Información básica del solicitante.
            .sort({ createdAt: -1 });

        // 2. Formatea cada solicitud con info adicional desde Profile.
        const formattedRequests = await Promise.all(
            requests.map(async (request) => {
                const profile = await Profile.findOne({ idUser: request.requester._id })
                    .select('name surname situation description profession photo');

                return {
                    friendshipId: request._id,
                    requester: {
                        id: request.requester._id,
                        username: request.requester.username,
                        email: request.requester.email
                    },
                    profile: profile || null,
                    requestedAt: request.createdAt
                };
            })
        );
        //#endregion

        //#region - | RESULT        |
        return res.status(200).json({
            success: true,
            count: formattedRequests.length,
            requests: formattedRequests
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [getPendingRequests]: ' + error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener solicitudes pendientes.',
            error: error.message
        });
        //#endregion
    };
};
export const getSentRequests = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene el ID del usuario autenticado desde el token.
        const userId = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // (2) - Busca todas las solicitudes de amistad enviadas por este usuario
        //       cuyo estado siga siendo 'Pendiente'.
        const sentRequests = await Friendship.find({
            requester: userId,
            status: 'Pendiente'
        })
            // (3) - Trae datos básicos del destinatario.
            .populate('recipient', 'username email')
            // (4) - Ordena por fecha de creación (más recientes primero).
            .sort({ createdAt: -1 });

        // (5) - Para cada solicitud enviada, obtenemos también su perfil asociado.
        const formattedRequests = await Promise.all(
            sentRequests.map(async (request) => {
                const profile = await Profile.findOne({ idUser: request.recipient._id })
                    .select('name surname situation description profession photo');

                // (6) - Devolvemos estructura amigable para el cliente.
                return {
                    friendshipId: request._id,
                    recipient: {
                        id: request.recipient._id,
                        username: request.recipient.username,
                        email: request.recipient.email
                    },
                    profile: profile || null,
                    sentAt: request.createdAt
                };
            })
        );
        //#endregion

        //#region - | RESULT        |
        // (7) - Retorna la lista de solicitudes enviadas
        return res.status(200).json({
            count: formattedRequests.length,
            sentRequests: formattedRequests
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [getSentRequests]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener solicitudes enviadas.',
            error: error.message
        });
        //#endregion
    };
};
export const getRelationshipStatus = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - userId objetivo (usuario del perfil que se está consultando)
        const { userId: targetUserId } = req.params;

        // (2) - Usuario autenticado que hace la consulta
        const currentUserId = req.user.id;
        //#endregion

        //#region - | VALIDATIONS   |
        // (3) - Evita consultar la relación con uno mismo.
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'No puedes verificar tu relación contigo mismo'
            });
        }
        //#endregion

        //#region - | PROCESS       |
        // (4) - Llama al método estático del modelo para obtener el estado de relación
        const relationship = await Friendship.getRelationshipStatus(
            currentUserId,
            targetUserId
        );
        //#endregion

        //#region - | RESULT        |
        // (5) - Si no existe relación previa entre ambos usuarios
        if (!relationship) {
            return res.status(200).json({
                status: null,
                message: 'No hay relación existente.'
            });
        }

        // (6) - Retorna información detallada de la relación
        return res.status(200).json({
            status: relationship.status,           // Pendiente | Aceptada | Rechazada
            isRequester: relationship.isRequester, // Si el usuario es quien envió la solicitud
            friendshipId: relationship.friendship._id,
            createdAt: relationship.friendship.createdAt,
            updatedAt: relationship.friendship.updatedAt
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        console.error('Error en el handler [getRelationshipStatus]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener estado de relación.',
            error: error.message
        });
        //#endregion
    };
};

