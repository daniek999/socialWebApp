import Post from '../models/post.js';

// MARK: [POST] createPost
export const createPost = async(req, res) => {
    // Defyning
    const { 
        title, 
        content 
    } = req.body;
    const idUser = req.user.id; // Traido del Middleware
    // Testing
    try {
        const newPost = new Post({
            idUser,
            title,
            content,
        });
        await newPost.save();
        res.status(201).json({ message: 'Post Creado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// MARK: [GET] getPosts
export const getPosts = async(req, res) => {
    try {
        const posts = await Post
            .find()
            .populate("idUser", "username");
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: 'Error: ' + error})
    }
};

// MARK: [DELETE] deletePost
export const deletePost = async (req, res) => {
    // Defyning
    const idUser = req.user.id;
    const idPost = req.params.id;
    // Testing
    try {
        // # Search the post.
        const post = await Post.findById(idPost)
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        // # Verify that he post belogns to the user.
        if (post.idUser.toString() !== idUser) {
        return res.status(403).json({ message: "No autorizado para eliminar este post" });
        }

        // # Delete the post.
        await Post.findByIdAndDelete(idPost);

        res.json({ message: "Post eliminado correctamente" });
    } catch (error) {
        res.json({ message: `Error: ${error.message}` })
    }
    
}