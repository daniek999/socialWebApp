import mongoose, { Schema, Types } from "mongoose";

// Schema
const profileSchema = new Schema({
    idUser: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true
    },
    // Datos Basicos
    name: {
        type: String,
        trim: true,
        required: true,
    },
    surname: {
        type: String,
        trim: true,
        required: true,
    },
    birthday: {
        type: Date,
    },
    interests: {
        type: [String]
    },
    // Datos Profesionales
    profession: {
        type: String,
        trim: true,
        required: true,
    },
    situation: {
        type: String,
        enum: ['Estudiante', 'Buscando', 'Practicante', 'Empleado'],
        default: 'Estudiante'
    },
    description: {
        type: String,
        trim: true,
        maxLength: 280
    },
    about: {
        type: String,
        trim: true
    },
    skills: {
        type: [String]
    },
    // Media
    photo: {
        type: String,
        default: ""
    },
    curriculumvitae: {
        type: String,
        default: ""
    },
    // Estado Visual del Perfil
    visible: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true});

// Generating
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;