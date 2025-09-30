import { Router } from 'express';
import Post from '../models/post.js';
import { verifyToken } from '../middleware/auth.js';
import post from '../models/post.js';

// -- Post Router -- //
const postRouter = Router();

// 1. Create Post
postRouter.post("/", verifyToken, async (req, res) => {
    const { title, content } = req.body;
    const idUser = req.user.id;

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
})
// 2. Read Posts
postRouter.get("/", async (req, res) => {
    const posts = await Post
        .find()
        .populate("idUser", "username");
    res.json(posts);
});
// 3. Delete Post
postRouter.delete("/:id", verifyToken, async (req, res) => {
    const idUser = req.user.id;
    const idPost = req.params.id;

    try {
        // 3.1. Search Post
        const post = await Post.findById(idPost)
        
        if (!post) {
            return res.status(404).json({ msg: "Post no encontrado" });
        }

        // 3.2. Verify that he post belogns to the user.
        if (post.idUser.toString() !== idUser) {
        return res.status(403).json({ msg: "No autorizado para eliminar este post" });
        }

        // 3.3. Delete
        await Post.findByIdAndDelete(idPost);

        res.json({ message: "Post eliminado correctamente" });
    } catch (error) {
        res.json({ message: `Error: ${error.message}` })
    }
});

export default postRouter;