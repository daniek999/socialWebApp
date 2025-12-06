import mongoose, { Schema, Types } from "mongoose";

// Schema
const postSchema = new Schema({
    idUser: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {timestamps: true});

// Generating
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;