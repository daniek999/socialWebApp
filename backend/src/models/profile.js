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
    employmentStatus: {
        type: String,
        enum: ['Estudiante', 'Buscando', 'Practicante', 'Empleado'],
        default: 'Estudiante'
    },
    about: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        default: ""
    },
    curriculumvitae: {
        type: String,
        default: ""
    },
    visible: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;