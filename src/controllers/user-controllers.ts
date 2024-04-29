import { Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
  userId?: string;
}

export const UserController = {
  profile: async (req: AuthRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req.userId)
        .select("-passwordHash -createdAt -updatedAt")
        .lean();

      if (!user) {
        return res.status(404).json({
          message: "The user was not found",
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error to get profile info :", error);
      res
        .status(500)
        .json({ message: "An error occurred while get profile info" });
    }
  },
  getAllUsers: async (req: AuthRequest, res: Response) => {
    try {
      const users = await UserModel.find().select("-passwordHash").lean();
      if (!users || !users.length) {
        return res.status(404).json({ error: "Users not found" });
      }

      res.json(users);
    } catch (error) {
      console.log();
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserById: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;

      const user = await UserModel.findById(userId)
        .select("-passwordHash")
        .lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user by id:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateUser: async (req: AuthRequest, res: Response) => {
    try {
      const { _id, email, name, passwordNew, passwordOld } = req.body;

      if (!_id || !name || !email) {
        return res
          .status(400)
          .json({ error: "All fields except password are required" });
      }

      const user = await UserModel.findById(_id).exec();

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const duplicate = await UserModel.findOne({ email }).lean().exec();
      if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ error: "Email already exists" });
      }

      user.name = name;
      user.email = email;

      if (passwordNew && passwordOld) {
        const isPasswordValid = await bcrypt.compare(
          passwordOld,
          user.passwordHash
        );
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid old password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(passwordNew, salt);
      }

      const updatedUser = await user.save();

      res.json({ error: `${updatedUser.name} updated` });
    } catch (error) {
      console.log();
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;

      const user = await UserModel.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ error: `${user.name} deleted` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
