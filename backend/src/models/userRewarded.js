import mongoose, { Schema, Types } from "mongoose";

/** [USER_REWARDED-SCHEMA]
 * 
 * Almacena el historial completo de sanciones las cuales pueden ser
 * suspensiones o baneos aplicadas a los usuarios de la plataforma.
 */

// Schema
const UserRewardedSchema = new Schema({
    idUser: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    idAchievement: {
        type: Types.ObjectId,
        ref: "Achievement",
        required: true,
    },
    notified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });

// Indexes
UserRewardedSchema.index({ idUser: 1, idAchievement: 1 },{ unique: true });

// Generating
const UserRewarded = mongoose.models.UserRewarded || mongoose.model('UserRewarded', UserRewardedSchema);
export default UserRewarded;