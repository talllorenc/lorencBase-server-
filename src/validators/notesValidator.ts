import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const notesValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("data").notEmpty().withMessage("Content is required"),
  body("tags").notEmpty().withMessage("Tags is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

export default notesValidator;
