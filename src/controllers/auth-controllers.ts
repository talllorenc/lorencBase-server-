import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

const jwtSecretKey = process.env.JWT_SECRET;
const jwtSecretKeyRefresh = process.env.JWT_SECRET_REFRESH;

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const doc = new UserModel({
        email,
        name,
        passwordHash,
      });

      const user = await doc.save();

      if (user) {
        res.status(201).json({ message: `New user ${name} created` });
      } else {
        res.status(400).json({ message: "Invalid user data received" });
      }
    } catch (error) {
      console.error("Error registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            _id: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
          },
        },
        jwtSecretKey,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign({ name: user.name }, jwtSecretKeyRefresh, {
        expiresIn: "7d",
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: "none", 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      res.json({ accessToken });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "An error occurred while logging in" });
    }
  },
};
