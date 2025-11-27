import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
}, {timestamps: true, versionKey: false});

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);

export default Achievement;