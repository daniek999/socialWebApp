import { Router } from "express";
import { verifyStatus, verifyToken, verifyVerification } from "../middleware/auth.js";
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

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * sendFriendRequest()      | POST      | User      | 'api/friendships/request'
 * acceptFriendRequest()    | PATCH     | User      | 'api/friendships/:friendshipId/accept'
 * rejectFriendRequest()    | DELETE    | User      | 'api/friendships/:friendshipId/reject'
 * cancelFriendRequest()    | DELETE    | User      | 'api/friendships/:friendshipId/cancel'
 * removeFriend()           | DELETE    | User      | 'api/friendships/:friendshipId'
 * getFriends()             | GET       | User      | 'api/friendships/friends'
 * getPendingRequests()     | GET       | User      | 'api/friendships/pending'
 * getSentRequests()        | GET       | User      | 'api/friendships/sent'
 * getRelationshipStatus()  | GET       | User      | 'api/friendships/status/:userId'
 * ---------------------------------------------------------------------------------
 */

const friendshipRouter = Router()

// [MIDDLEWARES] 
friendshipRouter.use(verifyToken);
friendshipRouter.use(verifyVerification);
friendshipRouter.use(verifyStatus);
// [ROUTES]
friendshipRouter.post('/request', sendFriendRequest);
friendshipRouter.patch('/:friendshipId/accept', acceptFriendRequest);
friendshipRouter.delete('/:friendshipId/reject', rejectFriendRequest);
friendshipRouter.delete('/:friendshipId/cancel', cancelFriendRequest);
friendshipRouter.delete('/:friendshipId', removeFriend);
friendshipRouter.get('/friends', getFriends);
friendshipRouter.get('/pending', getPendingRequests);
friendshipRouter.get('/sent', getSentRequests);
friendshipRouter.get('/status/:userId', getRelationshipStatus);

export default friendshipRouter;