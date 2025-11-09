import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createPost, deletePost, getPosts } from '../handlers/post.handler.js';

const postRouter = Router();

/* --------------------------------------------------------------------------
 POST ROUTES
-----------------------------------------------------------------------------
 - GET      /posts                  -> Listar todas las publicaciones
 - POST     /posts                  -> Crear nueva publicación
 - DELETE   /posts/:id              -> Eliminar una publicación por ID
-------------------------------------------------------------------------- */

// [USER] Obtener todas las publicaciones 
postRouter.get('/publications', verifyToken, getPosts);
// [USER] Crear nueva publicación
postRouter.post('/create-post', verifyToken, createPost);
// [USER] Eliminar publicación por ID
postRouter.delete('/delete-post/:_id', verifyToken, deletePost);

export default postRouter;