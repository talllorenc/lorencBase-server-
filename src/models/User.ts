import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: "user",
  },
  likedNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    }
  ],
  favoriteNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    }
  ],
},{
  timestamps: true,
})

export const UserModel = mongoose.model('User', UserSchema);
