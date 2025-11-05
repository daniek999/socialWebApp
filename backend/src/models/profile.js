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
        trim: true,
    },
    surname: {
        type: String,
        trim: true
    },
    profession: {
        type: String,
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
    },
    photo: {
        type: String,
        default: ""
    },
    curriculumvitae: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;