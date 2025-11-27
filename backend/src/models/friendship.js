import mongoose, { Schema, Types } from "mongoose";

// Schema / Table
const friendshipSchema = new Schema({
    requester: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Aceptado', 'Rechazado'],
        default: 'Pendiente'
    }
}, { timestamps: true });

// Indexes
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ status: 1 });
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });

// Static Methods
friendshipSchema.statics.areFriends = async function(userId1, userId2) {
    const friendship = await this.findOne({
        $or: [
            { requester: userId1, recipient: userId2, status: 'Aceptado' },
            { requester: userId2, recipient: userId1, status: 'Aceptado' }
        ]
    });
    return !!friendship;
};
friendshipSchema.statics.getRelationshipStatus = async function(userId1, userId2) {
    const friendship = await this.findOne({
        $or: [
            { requester: userId1, recipient: userId2 },
            { requester: userId2, recipient: userId1 }
        ]
    });
    
    if (!friendship) return null;
    
    return {
        status: friendship.status,
        isRequester: friendship.requester.toString() === userId1.toString(),
        friendship
    };
};


const Friendship = mongoose.models.Friendship || mongoose.model('Friendship', friendshipSchema);

export default Friendship;