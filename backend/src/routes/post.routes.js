import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../handlers/post.handler.js';

const postRouter = Router();

// Create Post
// ===========
postRouter.post('/create', verifyToken, createPost);
// Get All Posts
// =========
postRouter.get('/publications', getPosts);
// Delete Post
// =========
postRouter.delete('/:id', verifyToken, deletePost);

export default postRouter;