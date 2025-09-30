import mongoose, { Schema, Types } from "mongoose";

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

const post = mongoose.model('Post', postSchema)

export default post;