import mongoose, { Schema } from 'mongoose';

/** [USER-SCHEMA]
 * 
 * Esquema para los usuarios que se registren en la plataforma.
 */

// Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    status: {
        type: String,
        enum: ['Activo', 'Suspendido', 'Baneado'],
        default: 'Activo',
        required: true
    },
}, { timestamps: true });

// Indexes
userSchema.index({ status: 1 });

// Generating
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
