import mongoose, { Schema, Types } from 'mongoose';

// Schema
const UserSuspendedSchema = new Schema({
    // Common Data
    idUser: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['En Curso', 'Revocada', 'Expirada'],
        default: 'En Curso'
    },
    // If user got Suspended
    suspendedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    suspendedTime: {
        type: Number,
        default: null
    },
    suspendedAt: {
        type: Date,
        required: true
    },
    suspendedUntil: {
        type: Date,
        required: true
    },
    // If user suspension got Revoked
    revokedAt: {
        type: Date,
        default: null
    },
    revokedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    revokeReason: {
        type: String,
        default: null,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

// Indexes
UserSuspendedSchema.index({ idUser: 1, status: 1 });

// Generating
const UserSuspended = mongoose.models.UserSuspended || mongoose.model('UserSuspended', UserSuspendedSchema);
export default UserSuspended;