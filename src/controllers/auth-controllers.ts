import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
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
          },
        },
        jwtSecretKey,
        { expiresIn: "10s" }
      );

      const refreshToken = jwt.sign({ _id: user._id }, jwtSecretKeyRefresh, {
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
  refresh: async (req: Request, res: Response) => {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const refreshToken = cookies.jwt;

      jwt.verify(
        refreshToken,
        jwtSecretKeyRefresh,
        async (err: any, decoded: { _id: string }) => {
          if (err) return res.status(403).json({ message: "Forbidden" });

          const user = await UserModel.findOne({ _id: decoded._id }).exec();

          if (!user) return res.status(401).json({ message: "Unauthorized" });

          const accessToken = jwt.sign(
            {
              UserInfo: {
                _id: user._id,
              },
            },
            jwtSecretKey,
            { expiresIn: "10s" }
          );

          res.json({ accessToken });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  logout: async (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) 
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.json({ message: 'Cookie cleared' })
  }
};
