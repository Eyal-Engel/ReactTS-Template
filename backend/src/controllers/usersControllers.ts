import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { createHash } from "crypto";
import User from "../models/schemas/User";
import Command from "../models/schemas/Command";

dotenv.config();

// Function to verify if err is of type JsonWebTokenError
const isJsonWebTokenError = (err: any): err is jwt.JsonWebTokenError => {
  return err.name === "JsonWebTokenError";
};

// ************************************************************************************
// URL: http://localhost:5000/api/users
// METHOD: GET
// ************************************************************************************
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// URL: http://localhost:5000/api/users/{user_id}
// EXAMPLE URL: http://localhost:5000/api/users/c0e670a0-918b-4f91-9a62-d6b0460c9752
// METHOD: GET
// ************************************************************************************
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error(`User with ID ${userId} not found.`);
      (error as any).statusCode = 404;
      throw error;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// URL: http://localhost:5000/api/users/signup
// METHOD: POST
// BODY:
// {
//   "credentials": {
//     "privateNumber": "1234567",
//     "fullName": "Israel Israeli",
//     "password": "Aa123456",
//     "commandId": "38dd4929-d496-4df7-824d-3fa01a640ca3",
//     "editPerm": true,
//     "managePerm": false
//   },
//   "userId": "c0e670a0-918b-4f91-9a62-d6b0460c9752"
// }
// ************************************************************************************
const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    (error as any).statusCode = 422;
    return next(error);
  }
  const id = uuidv4();

  const { privateNumber, fullName, password, commandId, editPerm, managePerm } =
    req.body.credentials;
  const userId = req.body.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist" }] } });
    }
    if (!user.managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const existingUser = await User.findOne({ where: { privateNumber } });
    if (existingUser) {
      const error = new Error("User exists already, please login instead.");
      (error as any).statusCode = 422;
      throw error;
    }

    // Hashing the password using SHA-256
    const hashedPassword = createHash("sha256").update(password).digest("hex");

    const newUser = await User.create({
      id,
      privateNumber,
      fullName,
      password: hashedPassword,
      commandId,
      editPerm,
      managePerm,
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// URL: http://localhost:5000/api/users/login
// METHOD: POST
// BODY:
// {
//   "privateNumber": "user_private_number",
//   "password": "user_password"
// }
// ************************************************************************************
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { privateNumber, password } = req.body;
  const secretKey = process.env.SECRET_KEY;

  try {
    const existingUser = await User.findOne({ where: { privateNumber } });

    if (!existingUser) {
      const error = new Error("Invalid credentials, could not log you in.");
      (error as any).statusCode = 401;
      throw error;
    }

    const isValidPassword =
      existingUser.password ===
      createHash("sha256").update(password).digest("hex");
    if (!isValidPassword) {
      const error = new Error("Invalid credentials, could not log you in.");
      (error as any).statusCode = 401;
      throw error;
    }

    let token;
    try {
      if (!secretKey) {
        throw new Error("Secret key is not defined.");
      }
      token = jwt.sign(
        { userId: existingUser.id, privateNumber: existingUser.privateNumber },
        secretKey,
        { expiresIn: "168h" }
      );
    } catch (err) {
      return next(err);
    }

    res.json({
      userId: existingUser.id,
      privateNumber: existingUser.privateNumber,
      token: token,
    });
  } catch (err: any) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

// ************************************************************************************
// URL: http://localhost:5000/api/users/{user_id}
// EXAMPLE URL: http://localhost:5000/api/users/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: PATCH
// BODY:
// {
//   "updatedUserData": {
//     "privateNumber": "1234567",
//     "fullName": "full name",
//     "commandId": "38dd4929-d496-4df7-824d-3fa01a640ca3",
//     "editPerm": false,
//     "managePerm": true
//   },
//   "userUpdatingUserId": "c0e670a0-918b-4f91-9a62-d6b0460c9752"
// }
// ************************************************************************************
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const { privateNumber, fullName, commandId, editPerm, managePerm } =
    req.body.updatedUserData;
  const userUpdatingUserId = req.body.userUpdatingUserId;

  try {
    const userRequested = await User.findByPk(userUpdatingUserId);
    if (!userRequested || !userRequested.managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error(
        `Could not update user ${userId}, user doesn't exist.`
      );
      (error as any).statusCode = 403;
      throw error;
    }

    const command = await Command.findByPk(userRequested.commandId);
    if (!command) {
      const error = new Error(
        `Could not update user ${userId}, command ${userRequested.commandId} doesn't exist.`
      );
      (error as any).statusCode = 403;
      throw error;
    }

    if (privateNumber !== undefined) user.privateNumber = privateNumber;
    if (fullName !== undefined) user.fullName = fullName;
    if (commandId !== undefined) user.commandId = commandId;
    if (editPerm !== undefined) user.editPerm = editPerm;
    if (managePerm !== undefined) user.managePerm = managePerm;

    await user.save();

    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// URL:  http://localhost:5000/api/users/password/{userId}
// EXAMPLE URL: http://localhost:5000/api/users/password/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: POST
// BODY:
// {
//   "newPassword": "new_password",
//   "userUpdatingUserId": "user_id_of_who_fetch_this_request"
// }
// ************************************************************************************
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const { newPassword, userUpdatingUserId } = req.body;

  try {
    const userRequested = await User.findByPk(userUpdatingUserId);
    if (!userRequested || !userRequested.managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error(
        `Could not update user ${userId}, user doesn't exist.`
      );
      (error as any).statusCode = 403;
      throw error;
    }

    // Hashing the new password using SHA-256
    const hashedPassword = createHash("sha256")
      .update(newPassword)
      .digest("hex");

    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// URL:  http://localhost:5000/api/users/{userId}
// EXAMPLE URL: http://localhost:5000/api/users/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: DELETE
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to delete user, try later.");
      (error as any).statusCode = 422;
      throw error;
    }

    const userId = req.params.userId;
    const secretKey = process.env.SECRET_KEY;

    // Check if authorization header exists and extract token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const error = new Error("Authorization header is missing.");
      (error as any).statusCode = 401;
      throw error;
    }

    // Split token
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Token is missing.");
      (error as any).statusCode = 401;
      throw error;
    }

    try {
      // Decode token
      const decodedToken: any = jwt.verify(token, secretKey as Secret); // Type assertion to Secret
      if (!decodedToken || !decodedToken.userId) {
        throw new Error("Invalid token format or missing userId.");
      }
      const userUpdatingUserId = decodedToken.userId;

      const userRequested = await User.findByPk(userUpdatingUserId);
      if (!userRequested || !userRequested.managePerm) {
        return res
          .status(403)
          .json({ body: { errors: [{ message: "User is not authorized" }] } });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error(
          `Could not delete user ${userId}, user doesn't exist.`
        );
        (error as any).statusCode = 404;
        throw error;
      }

      await user.destroy();

      res.status(200).json({ message: `User ${userId} deleted successfully.` });
    } catch (err) {
      // Handle JWT verification error using type guard
      if (isJsonWebTokenError(err)) {
        return res.status(401).json({ message: "Invalid token." });
      }
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export {
  getUsers,
  getUserById,
  signup,
  login,
  updateUser,
  changePassword,
  deleteUser,
};
