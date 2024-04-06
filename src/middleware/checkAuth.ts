import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwtSecretKey = process.env.JWT_SECRET;

interface IIsAuth extends Request {
  userId?: string;
}

const checkAuth = (req: IIsAuth, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    const decodedToken = jwt.verify(token, jwtSecretKey) as { _id: string };
    req.userId = decodedToken._id;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default checkAuth;
