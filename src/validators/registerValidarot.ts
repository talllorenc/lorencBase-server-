import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const registrationValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("name")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
    .withMessage(
      "The password must contain at least one capital letter and one special character"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("You must type a confirmation password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default registrationValidator;
