import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../handlers/post.handler.js';

const postRouter = Router();

/* ==========================================================================
 POST ROUTES [3]
=============================================================================
 - GET      /api/posts                                  -> Listar todas las publicaciones
 - POST     /api/posts                                  -> Crear nueva publicación
 - DELETE   /api/posts/:id                              -> Eliminar una publicación por ID
========================================================================== */

// [GLOBAL] Middleware of token verification for all routes below
postRouter.use(verifyToken);

// [USER] 
postRouter.get('/publications', getPosts);
// [USER]
postRouter.post('/create-post', createPost);
// [USER]
postRouter.delete('/delete-post/:_id', deletePost);

export default postRouter;