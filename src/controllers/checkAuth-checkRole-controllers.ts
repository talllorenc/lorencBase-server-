import { Request, Response } from "express";

export const InSystemController = {
  inSystem: async (req: Request, res: Response) => {
   res.send("inSystem")
  },
  isAdmin: async (req: Request, res: Response) => {
    res.send("isAdmin")
  },
};
