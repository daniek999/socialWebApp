import { Router } from 'express';
import { verifyStatus, verifyToken, verifyVerification } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../handlers/post.handler.js';

/**
 * ---------------------------------------------------------------------------------
 * HANDLER                  | METHOD    | ACCESS    | ROUTE                           
 * ---------------------------------------------------------------------------------
 * getPosts()               | GET       | User      | 'api/posts/publications'
 * createPost()             | POST      | User      | 'api/posts/create-post'
 * deletePost()             | DELETE    | User      | 'api/posts/delete-post/:_id'
 * ---------------------------------------------------------------------------------
 */

const postRouter = Router();

// [MIDDLEWARES] 
postRouter.use(verifyToken);
postRouter.use(verifyVerification);
postRouter.use(verifyStatus);
// [ROUTES]
postRouter.get('/publications', getPosts);
postRouter.post('/create-post', createPost);
postRouter.delete('/delete-post/:_id', deletePost);

export default postRouter;