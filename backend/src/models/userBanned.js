import mongoose, { Schema, Types } from 'mongoose';

// Schema
const UserBannedSchema = new Schema({
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
        enum: ['Activo', 'Revocado'],
        default: 'Activo'
    },
    // If user got Banned
    bannedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    // If user ban got Revoked
    revokedAt: {
        type: Date,
        default: null
    },
    revokedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
    revokeReason: {
        type: String,
        default: null,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

// Indexes
UserBannedSchema.index({ idUser: 1, status: 1 });

// Generating
const UserBanned = mongoose.models.UserBanned || mongoose.model('UserBanned', UserBannedSchema);
export default UserBanned;