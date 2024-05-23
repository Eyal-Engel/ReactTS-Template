import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the userData property
interface CustomRequest extends Request {
  userData?: { userId: string };
}

const checkAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const secretKey = process.env.SECRET_KEY as string;

    const token = req.headers.authorization?.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, secretKey) as { userId: string };
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new Error("Authentication failed!") as any;
    error.statusCode = 403;
    return next(error);
  }
};

export default checkAuth;
