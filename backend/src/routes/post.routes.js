import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../handlers/post.handler.js';

const postRouter = Router();

// Read 
// NOTA: Averiguar porque no carga con verifyToken
postRouter.get('/publications', verifyToken, getPosts);

// Create
postRouter.post('/create-post', verifyToken, createPost);

// Delete
postRouter.delete('/delete-post/:_id', verifyToken, deletePost);

export default postRouter;