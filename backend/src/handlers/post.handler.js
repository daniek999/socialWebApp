import Post from '../models/post.js';

/** [ POST HANDLER ]
 *  -------------------------------------------------------------------------
 *  FUNCTION                | DESCRIPTION                           
 *  -------------------------------------------------------------------------
 *  createPost()            | Crea un nuevo post asociado a un usuario autenticado.
 *  getPosts()              | Obtiene todos los posts, incluyendo datos del autor.
 *  deletePost()            | Elimina un post si pertenece al usuario autenticado.
 */


//* [HANDLER ACTIONS]
export const createPost = async(req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene parámetros enviados desde el cliente
        const { title,  content } = req.body;

        // (2) - Obtiene el ID del usuario desde el token (middleware)
        const idUser = req.user.id;
        //#endregion

        //#region - | PROCESS       |
        // (3) - Crea una nueva instancia del Post
        const newPost = new Post({
            idUser,
            title,
            content,
        });
        
        // (4) - Guarda el post en la base de datos
        await newPost.save();
        //#endregion

        //#region - | RESULT        |
        // (5) - Retorna la respuesta exitosa
        return res.status(201).json({ 
            success: true,
            message: 'Post Creado' 
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(400).json({ 
            success: false,
            message: "Error al crear la publicacion.",
            error: error.message
        });
        //#endregion
    };
};
export const getPosts = async(req, res) => {
    try {
        //#region - | PROCESS       |
        // (1) - Obtiene todos los posts y popula el username del autor
        const posts = await Post
            .find()
            .populate("idUser", "username");
        //#endregion

        //#region - | RESULT        |
        // (2) - Retorna la lista de posts
        return res.status(200).json({
            success: true,
            message: "Publicaciones obtenidas correctamente",
            data: posts
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(400).json({ 
            success: false,
            message: "Error al obtener las publicaciones.",
            error: error.message
        });
        //#endregion
    };
};

export const deletePost = async (req, res) => {
    try {
        //#region - | PARAMS        |
        // (1) - Obtiene IDs relevantes
        const idUser = req.user.id;
        const idPost = req.params._id;
        //#endregion

        //#region - | VERIFICATIONS |
        // (2) - Busca el post solicitado
        const post = await Post.findById(idPost);
        
        // (3) - Verifica que el post exista
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        };

        // (4) - Verifica si el post pertenece al usuario autenticado
        if (post.idUser.toString() !== idUser) {
            return res.status(403).json({ message: "No autorizado para eliminar este post" });
        };
        //#endregion

        //#region - | PROCESS       |
        // (5) - Elimina el post
        await Post.findByIdAndDelete(idPost);
        //#endregion

        //#region - | RESULT        |
        // (6) - Retorna respuesta final
        return res.status(204).json({
            success: true,
            message: "Post eliminado correctamente",
        });
        //#endregion
    } catch (error) {
        //#region - | ERROR         |
        return res.status(400).json({ 
            success: false,
            message: "Error al eliminar un post.",
            error: error.message
        });
        //#endregion
    };
};