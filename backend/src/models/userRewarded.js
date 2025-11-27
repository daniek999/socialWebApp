import mongoose, { Schema, Types } from "mongoose";

const UserRewardedSchema = new Schema({
    idUser: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    idAchievement: {
        type: Types.ObjectId,
        ref: "Achievement",
        required: true,
        unique: true
    },
    notified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });

// Evita que un usuario gane el mismo logro 2 veces
UserRewardedSchema.index(
    { idUser: 1, idAchievement: 1 },
    { unique: true }
);

const UserRewarded = mongoose.models.UserRewarded || mongoose.model('UserRewarded', UserRewardedSchema);

export default UserRewarded;
