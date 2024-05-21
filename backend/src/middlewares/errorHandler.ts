import { Response } from "express";

export const handleError = (error: any, res: Response) => {
  console.error("Error:", error);
  res.status(500).json({ error: "Internal server error" });
};
