import { Request, Response } from "express";
import { NoteModel } from "../models/Note";
import edjsHTML from "editorjs-html"

const edjsParser = edjsHTML();


export const NoteController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const notes = await NoteModel.find().lean();

      if (!notes || !notes.length) {
        return res.status(404).json({ message: "Notes not found" });
      }

      res.json(notes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const { data, title, tags } = req.body;

      const html = edjsParser.parse(data);

      const note = new NoteModel({
        title,
        content: html,
        tags
      });

      await note.save();

      res.status(201).json({ message: "Note created successfully", note });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const note = await NoteModel.findByIdAndDelete(id).lean();
      if(!note){
        return res.status(404).json({ message: "Note not found" });
      }

      res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
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
  }
};
