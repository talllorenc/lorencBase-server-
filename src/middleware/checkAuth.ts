import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const jwtSecretKey = process.env.JWT_SECRET;

interface IIsAuth extends Request {
  userId?: string;
  userRole?: string;
}

const checkAuth = (req: IIsAuth, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    const decodedToken = jwt.verify(token, jwtSecretKey) as { UserInfo: { _id: string, role: string }  };
    req.userId = decodedToken.UserInfo._id; 
    req.userRole = decodedToken.UserInfo.role; 
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkAuth;
