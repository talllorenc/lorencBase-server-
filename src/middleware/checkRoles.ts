import { UserModel } from "../models/users";
import { Request, Response, NextFunction } from "express";

interface IRole extends Request {
  userId?: string;
}

const checkRoles =
  (role: string) => async (req: IRole, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.userId);

      if (user.role !== role) {
        return res.status(403).json({ error: "No access. Insufficient role permissions" });
      }

      next();
    } catch (error) {
      console.error("Error authorizing user:", error);
      res
        .status(500)
        .json({ error: "An error occurred while authorizing the user" });
    }
  };

export default checkRoles;
