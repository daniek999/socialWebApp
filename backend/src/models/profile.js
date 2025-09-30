import mongoose, { Schema, Types } from "mongoose";

const profileSchema = new Schema({
    idUser: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    interests: [
        { type: String }
    ],
    hobbies: [
        { type: String }
    ],
    visible: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

const profile = mongoose.model('Profile', profileSchema)

export default profile;