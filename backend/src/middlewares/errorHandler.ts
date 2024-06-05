import { Response } from "express";

export const handleError = (error: Error, res: Response) => {
  console.error("Error:", error);
  res.status(500).json(error);
};
