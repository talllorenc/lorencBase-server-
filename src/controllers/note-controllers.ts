import { Request, Response } from "express";
import { NoteModel } from "../models/Note";
import edjsHTML from "editorjs-html";
import { UserModel } from "../models/User";

const edjsParser = edjsHTML();

interface AuthRequest extends Request {
  userId?: string;
}

export const NoteController = {
  getAll: async (req: Request, res: Response) => {
    try {
      console.log(req.query);
      
      const notes = await NoteModel.find(req.query).lean();

      if (!notes || !notes.length) {
        return res.status(404).json({ message: "Notes not found" });
      }

      res.json(notes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getOneBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const updatedNote = await NoteModel.findOneAndUpdate(
        { slug: slug },
        { $inc: { viewsCount: 1 } },
        { new: true }
      );

      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json(updatedNote);
    } catch (error) {
      console.error("Error fetching note by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getOneById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const note = await NoteModel.findById(id);

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json(note);
    } catch (error) {
      console.error("Error fetching note by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { data, title, description, tags, category } = req.body;

      const html = edjsParser.parse(data);

      let slug = title.toLocaleLowerCase().trim().replaceAll(" ", "-");

      const note = new NoteModel({
        title,
        description,
        content: html,
        tags,
        slug,
        category,
        createdBy: req.userId,
      });

      await note.save();

      res.status(201).json({ message: "Note created successfully", note });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const note = await NoteModel.findByIdAndDelete(id).lean();
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if(note.createdBy.toString() !== req.userId) {
        return res.status(401).json({ message: "Forbidden. You are not the creator of note" });
      }

      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  like: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const noteId = req.params.id;

      const note = await NoteModel.findOne({ _id: noteId });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const user = await UserModel.findOne({
        _id: userId,
        likedNotes: note._id,
      });

      if (user) {
        return res.status(400).json({ message: "You already liked this post" });
      }

      const updatedNote = await NoteModel.findOneAndUpdate(
        { _id: noteId },
        {
          $push: { likes: userId },
        },
        {
          new: true,
        }
      );

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: { likedNotes: note._id },
        },
        {
          new: true,
        }
      );

      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Note liked successfully" });
    } catch (error) {
      console.error("Error liking note:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  unlike: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const noteId = req.params.id;

      const note = await NoteModel.findOne({ _id: noteId });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const user = await UserModel.findOne({
        _id: userId,
        likedNotes: note._id,
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "You have not liked this post yet" });
      }

      const updatedNote = await NoteModel.findOneAndUpdate(
        { _id: noteId },
        {
          $pull: { likes: userId }, 
        },
        {
          new: true,
        }
      );

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { likedNotes: note._id }, 
        },
        {
          new: true,
        }
      );

      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Note unliked successfully" });
    } catch (error) {
      console.error("Error unliking note:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  addToFavorites: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const noteId = req.params.id;

      const note = await NoteModel.findOne({ _id: noteId });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const user = await UserModel.findOne({
        _id: userId,
        favoriteNotes: note._id,
      });

      if (user) {
        return res.status(400).json({ message: "Note already in favorites" });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: { favoriteNotes: note._id },
        },
        {
          new: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Note added to favorites successfully" });

    } catch (error) {
      console.error("Error unliking note:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  removeFromFavorites: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const noteId = req.params.id;

      const note = await NoteModel.findOne({ _id: noteId });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const user = await UserModel.findOne({
        _id: userId,
        favoriteNotes: note._id,
      });

      if (!user) {
        return res.status(400).json({ message: "Note not in favorites" });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { favoriteNotes: note._id },
        },
        {
          new: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Note removed from favorites successfully" });
    } catch (error) {
      console.error("Error unliking note:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  upload: async (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: 1,
        file: {
          url: `/public/images/${req.file.originalname}`,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
