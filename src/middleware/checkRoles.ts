import { Request, Response, NextFunction } from "express";

interface IRole extends Request {
  userRole?: string;
}

const checkRoles =
  (role: string) => async (req: IRole, res: Response, next: NextFunction) => {
    try {
      if (req.userRole !== role) {
        return res.status(403).json({ message: "No access. Insufficient role permissions" });
      }

      next();
    } catch (error) {
      console.error("Error authorizing user:", error);
      res
        .status(500)
        .json({ message: "An error occurred while authorizing the user" });
    }
  };

export default checkRoles;
