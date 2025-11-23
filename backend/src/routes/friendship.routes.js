import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { acceptFriendRequest, 
    cancelFriendRequest, 
    getFriends, 
    getPendingRequests, 
    getRelationshipStatus, 
    getSentRequests, 
    rejectFriendRequest, 
    removeFriend, 
    sendFriendRequest 
} from "../handlers/friendship.handler.js";

const friendshipRouter = Router()

/* ==========================================================================
 FRIENDSHIP ROUTES [9]
=============================================================================
 - POST     /api/friendships/request                    -> Enviar solicitud de amistad a otro usuario
 - PATCH    /api/friendships/:friendshipId/accept       -> Aceptar una solicitud de amistad recibida
 - DELETE   /api/friendships/:friendshipId/reject       -> Rechazar una solicitud de amistad recibida
 - DELETE   /api/friendships/:friendshipId/cancel       -> Cancelar una solicitud de amistad que un usuario envié
 - DELETE   /api/friendships/:friendshipId              -> Eliminar una amistad ya aceptada anteriormente
 - GET      /api/friendships/friends                    -> Obtener lista de todos mis amigos confirmados (status: 'Aceptado')
 - GET      /api/friendships/pending                    -> Listar solicitudes de amistad RECIBIDAS pendientes de respuesta
 - GET      /api/friendships/sent                       -> Listar solicitudes de amistad ENVIADAS pendientes de respuesta
 - GET      /api/friendships/status/:userId             -> Verificar el estado de mi relación con un usuario específico
========================================================================== */

// [GLOBAL] Middleware of token verification for all routes below
friendshipRouter.use(verifyToken);

// [USER]
friendshipRouter.post('/request', sendFriendRequest);
// [USER]
friendshipRouter.patch('/:friendshipId/accept', acceptFriendRequest);
// [USER]
friendshipRouter.delete('/:friendshipId/reject', rejectFriendRequest);
// [USER]
friendshipRouter.delete('/:friendshipId/cancel', cancelFriendRequest);
// [USER]
friendshipRouter.delete('/:friendshipId', removeFriend);
// [USER]
friendshipRouter.get('/friends', getFriends);
// [USER]
friendshipRouter.get('/pending', getPendingRequests);
// [USER]
friendshipRouter.get('/sent', getSentRequests);
// [USER]
friendshipRouter.get('/status/:userId', getRelationshipStatus);

export default friendshipRouter;