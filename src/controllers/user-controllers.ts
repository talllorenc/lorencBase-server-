import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { UserModel } from "../models/users";

const jwtSecretKey = process.env.JWT_SECRET;

interface AuthRequest extends Request {
  userId?: string;
}

export const UserController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, name, password, confirmPassword } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: "An account with such a email has already been registered",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        email,
        name,
        passwordHash,
      });

      const user = await doc.save();

      const token = jwt.sign({ _id: user._id }, jwtSecretKey, {
        expiresIn: "30d",
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        jwtSecretKey,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "An error occurred while logging in" });
    }
  },
  profile: async (req: AuthRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          error: "The user was not found",
        });
      }

      res.json({
        ...user.toJSON(),
      });
    } catch (error) {
      console.error("Error to get profile info :", error);
      res
        .status(500)
        .json({ error: "An error occurred while get profile info" });
    }
  },
};
