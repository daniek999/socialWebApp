import Post from '../models/post.js';

/* ----- [ POST HANDLER] ----- */

// [POST] - 'posts/publications'
export const createPost = async(req, res) => {
    try {
        // Params
        const { title,  content } = req.body;
        const idUser = req.user.id; // From Middleware
        const newPost = new Post({
            idUser,
            title,
            content,
        });
        // Process
        await newPost.save();

        // Result
        res.status(201).json({ message: 'Post Creado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// [GET] - 'auth/create-post'
export const getPosts = async(req, res) => {
    try {
        // Process
        const posts = await Post
            .find()
            .populate("idUser", "username");
            
        // Result
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error})
    }
};

// [DELETE] - 'auth/delete-post/:_id'
export const deletePost = async (req, res) => {
    try {
        // Params
        const idUser = req.user.id;
        const idPost = req.params._id;
        const post = await Post.findById(idPost)

        // Verifications
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }
        if (post.idUser.toString() !== idUser) {
            return res.status(403).json({ message: "No autorizado para eliminar este post" });
        }

        // Process
        await Post.findByIdAndDelete(idPost);

        // Result
        res.json({ message: "Post eliminado correctamente" });
    } catch (error) {
        res.json({ message: `Error: ${error.message}` })
    }
    
}