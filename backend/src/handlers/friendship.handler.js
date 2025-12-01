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
        //#region [ Params ]
        const { recipientId } = req.body;
        const requesterId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. recipientId es válido
        if (!recipientId) {
            return res.status(400).json({ 
                message: 'El ID del usuario destinatario es requerido' 
            });
        }
        // 2. Validar formato de ObjectId *Este se puede eliminar aunque sea importante
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ 
                message: 'ID de usuario inválido' 
            });
        }
        // 3. No enviarse solicitud a sí mismo
        if (requesterId === recipientId) {
            return res.status(400).json({ 
                message: 'No puedes enviarte una solicitud a ti mismo' 
            });
        }
        // 4. El recipient existe
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ 
                message: 'Usuario no encontrado' 
            });
        }
        // 5. Verificar solicitud existente en AMBAS direcciones
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });
        if (existingFriendship) {
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
            } else if (existingFriendship.status === 'Aceptado') {
                return res.status(409).json({ 
                    message: 'Ya son amigos.' 
                });
            } else if (existingFriendship.status === 'Rechazado') {
                await Friendship.findByIdAndDelete(existingFriendship._id);
            }
        }
        //#endregion

        //#region [ Process ]
        const friendship = await Friendship.create({
            requester: requesterId,
            recipient: recipientId,
            status: 'Pendiente'
        });
        await friendship.populate('recipient', 'username email');
        //#endregion

        //#region [ Result ]
        return res.status(201).json({
            message: 'Solicitud de amistad enviada correctamente',
            friendship
        });
        //#endregion
    
    } catch (error) {
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
    }
};
export const acceptFriendRequest = async (req, res) => {
    try {
        //#region [ Params ]
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. Verificar existencia de la solicitud
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }
        // 2. Solo el receptor puede aceptar
        if (friendshipSolicitude.recipient.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permiso para aceptar esta solicitud'
            });
        }
        // 3. Solicitud debe estar pendiente
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(400).json({
                message: `Esta solicitud ya fue ${friendshipSolicitude.status === 'Aceptado' ? 'Aceptada' : 'Rechazada'}`
            });
        }
        //#endregion

        //#region [ Process ]
        friendshipSolicitude.status = 'Aceptado';
        await friendshipSolicitude.save();
        await friendshipSolicitude.populate([
            { path: 'requester', select: 'username email' },
            { path: 'recipient', select: 'username email' }
        ]);
        //#endregion

        //#region [ Result ]
        return res.status(200).json({
            message: 'Solicitud aceptada correctamente.',
            friendship: friendshipSolicitude
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [acceptFriendRequest]: ' + error);
        return res.status(500).json({
            message: 'Error al aceptar la solicitud de amistad.',
            error: error.message
        });
    }
};
export const rejectFriendRequest = async (req, res) => {
    try {
        //#region [ Params ]
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. Solicitud debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }
        // 2. Solo el receptor puede rechazar
        if (friendshipSolicitude.recipient.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permisos sobre esta solicitud.'
            });
        }
        // 3. Debe estar pendiente
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(400).json({
                message: 'Esta solicitud ya fue procesada.'
            });
        }
        //#endregion

        //#region [ Process ]
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region [ Result ]
        return res.status(200).json({
            message: 'Solicitud rechazada correctamente.'
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [rejectFriendRequest]: ' + error);
        return res.status(500).json({
            message: 'Error al rechazar la solicitud de amistad.',
            error: error.message
        });
    }
};
export const cancelFriendRequest = async (req, res) => {
    try {
        //#region [ Params ]
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. Solicitud debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Solicitud de amistad no encontrada'
            });
        }
        // 2. Solo el emisor puede cancelar
        if (friendshipSolicitude.requester.toString() !== userId) {
            return res.status(403).json({
                message: 'No tienes permiso para cancelar esta solicitud'
            });
        }
        // 3. Debe estar pendiente
        if (friendshipSolicitude.status !== 'Pendiente') {
            return res.status(403).json({
                message: 'Solo puedes cancelar solicitudes pendientes'
            });
        }
        //#endregion

        //#region [ Process ]
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region [ Result ]
        return res.status(200).json({
            message: 'Solicitud cancelada correctamente.'
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [cancelFriendRequest]: ' + error);
        return res.status(500).json({
            message: 'Error al cancelar la solicitud de amistad.',
            error: error.message
        });
    }
};
export const removeFriend = async (req, res) => {
    try {
        //#region [ Params ]
        const { friendshipId } = req.params;
        const userId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. Relación debe existir
        const friendshipSolicitude = await Friendship.findById(friendshipId);
        if (!friendshipSolicitude) {
            return res.status(404).json({
                message: 'Amistad no encontrada.'
            });
        }
        // 2. Usuario debe ser parte de la amistad
        const isRequester = friendshipSolicitude.requester.toString() === userId;
        const isRecipient = friendshipSolicitude.recipient.toString() === userId;
        if (!isRequester && !isRecipient) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta amistad.'
            });
        }
        // 3. Debe ser amistad confirmada
        if (friendshipSolicitude.status !== 'Aceptado') {
            return res.status(400).json({
                message: 'Solo puedes eliminar amistades confirmadas.'
            });
        }
        //#endregion

        //#region [ Process ]
        await Friendship.findByIdAndDelete(friendshipId);
        //#endregion

        //#region [ Result ]
        return res.status(200).json({
            message: 'Amistad eliminada correctamente.'
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [removeFriend]: ' + error);
        return res.status(500).json({
            message: 'Error al eliminar amistad.',
            error: error.message
        });
    }
};
export const getFriends = async (req, res) => {
    try {
        //#region [ Params ]
        const userId = req.user.id;
        //#endregion

        //#region [ Process ]
        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'Aceptado' },
                { recipient: userId, status: 'Aceptado' }
            ]
        })
            .populate('requester', 'username email')
            .populate('recipient', 'username email')
            .sort({ updatedAt: -1 });

        const friends = await Promise.all(
            friendships.map(async (friendship) => {
                const friendUser =
                    friendship.requester._id.toString() === userId
                        ? friendship.recipient
                        : friendship.requester;

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

        //#region [ Result ]
        return res.status(200).json({
            count: friends.length,
            friends
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [getFriends]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener listado de amistades.',
            error: error.message
        });
    }
};
export const getPendingRequests = async (req, res) => {
    try {
        //#region [ Params ]
        const userId = req.user.id;
        //#endregion

        //#region [ Process ]
        const requests = await Friendship.find({
            recipient: userId,
            status: 'Pendiente'
        })
            .populate('requester', 'username email')
            .sort({ createdAt: -1 });

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

        //#region [ Result ]
        return res.status(200).json({
            count: formattedRequests.length,
            requests: formattedRequests
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [getPendingRequests]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener solicitudes pendientes.',
            error: error.message
        });
    }
};
export const getSentRequests = async (req, res) => {
    try {
        //#region [ Params ]
        const userId = req.user.id;
        //#endregion

        //#region [ Process ]
        const sentRequests = await Friendship.find({
            requester: userId,
            status: 'Pendiente'
        })
            .populate('recipient', 'username email')
            .sort({ createdAt: -1 });

        const formattedRequests = await Promise.all(
            sentRequests.map(async (request) => {
                const profile = await Profile.findOne({ idUser: request.recipient._id })
                    .select('name surname situation description profession photo');

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

        //#region [ Result ]
        return res.status(200).json({
            count: formattedRequests.length,
            sentRequests: formattedRequests
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [getSentRequests]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener solicitudes enviadas.',
            error: error.message
        });
    }
};
export const getRelationshipStatus = async (req, res) => {
    try {
        //#region [ Params ]
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user.id;
        //#endregion

        //#region [ Validations ]
        // 1. No puede consultarse contra sí mismo
        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'No puedes verificar tu relación contigo mismo'
            });
        }
        //#endregion

        //#region [ Process ]
        const relationship = await Friendship.getRelationshipStatus(
            currentUserId,
            targetUserId
        );
        //#endregion

        //#region [ Result ]
        if (!relationship) {
            return res.status(200).json({
                status: null,
                message: 'No hay relación existente.'
            });
        }

        return res.status(200).json({
            status: relationship.status,
            isRequester: relationship.isRequester,
            friendshipId: relationship.friendship._id,
            createdAt: relationship.friendship.createdAt,
            updatedAt: relationship.friendship.updatedAt
        });
        //#endregion

    } catch (error) {
        console.error('Error en el handler [getRelationshipStatus]: ' + error);
        return res.status(500).json({
            message: 'Error al obtener estado de relación.',
            error: error.message
        });
    }
};
