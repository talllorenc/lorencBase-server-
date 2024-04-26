import mongoose from "mongoose";

const AutoIncrement = require("mongoose-sequence")(mongoose);

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: [String], 
      required: true, 
    },
    tags: {
      type: [String],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const NoteModel = mongoose.model("Note", NoteSchema);
