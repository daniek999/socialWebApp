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
        default: true,
        trim: true,
    },
    surname: {
        type: String,
        default: true,
        trim: true
    },
    profession: {
        type: String,
        default: true,
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
        default: false
    }
}, {timestamps: true});

const profile = mongoose.model('Profile', profileSchema)

export default profile;