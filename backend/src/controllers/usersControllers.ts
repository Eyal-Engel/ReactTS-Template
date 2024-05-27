import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { createHash } from "crypto";
import User from "../models/schemas/User";
import Command from "../models/schemas/Command";

dotenv.config();

const secretKey = process.env.SECRET_KEY as jwt.Secret;

if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in the environment variables");
}

// check if error type is invalid jwt token
const isJsonWebTokenError = (err: any): err is jwt.JsonWebTokenError => {
  return err.name === "JsonWebTokenError";
};

// ************************************************************************************
// Functionality: Get all users.
// URL: http://localhost:5000/api/users
// METHOD: GET
// ************************************************************************************
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const users = await User.findAll({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// Functionality: Get a user by ID.
// URL: http://localhost:5000/api/users/{user_id}
// EXAMPLE URL: http://localhost:5000/api/users/c0e670a0-918b-4f91-9a62-d6b0460c9752
// METHOD: GET
// ************************************************************************************
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (
      res
        .status(422)
        // .json({ errors: [{ message: "Failed to delete user, try later." }] });
        .json(errors)
    );
  }
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ message: `User with ID ${userId} not found.` }] });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// Functionality: Create a new user.
// URL: http://localhost:5000/api/users/signup
// METHOD: POST
// BODY:
// {
//     "privateNumber": "1234567",
//     "fullName": "Israel Israeli",
//     "password": "Aa123456",
//     "commandId": "38dd4929-d496-4df7-824d-3fa01a640ca3",
//     "editPerm": true,
//     "managePerm": false
// }
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: [{ message: "Invalid inputs passed, please check your data." }],
    });
  }
  const id = uuidv4();
  const { privateNumber, fullName, password, commandId, editPerm, managePerm } =
    req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ errors: [{ message: "Authorization header is missing." }] });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ message: "Token is missing." }] });
    }

    try {
      const decodedToken = jwt.verify(token, secretKey) as any;
      const userUpdatingUserId = decodedToken.userId;

      const userRequested = await User.findByPk(userUpdatingUserId);
      if (!userRequested || !userRequested.managePerm) {
        return res
          .status(403)
          .json({ errors: [{ message: "User is not authorized" }] });
      }

      const existingUser = await User.findOne({ where: { privateNumber } });
      if (existingUser) {
        return res.status(422).json({
          errors: [{ message: "User exists already, please login instead." }],
        });
      }

      const hashedPassword = createHash("sha256")
        .update(password)
        .digest("hex");

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
    } catch (err: any) {
      // explicitly define type of err as Error
      // if (isJsonWebTokenError(err)) {
      //   return res
      //     .status(401)
      //     .json({ errors: [{ message: "Invalid token." }] });
      // }

      // if (err.name === "SequelizeForeignKeyConstraintError") {
      res.status(422).json({
        errors: [
          {
            message: err.message,
            detail: err.detail,
            constraint: err.constraint,
            schema: err.schema,
            table: err.table,
          },
        ],
      });
      // }

      next(err);
    }
  } catch (err: any) {
    // explicitly define type of err as Error
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
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: [{ message: "Failed to delete user, try later." }] });
  }
  const { privateNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { privateNumber } });

    if (!existingUser) {
      return res.status(401).json({
        errors: [{ message: "Invalid credentials, could not log you in." }],
      });
    }

    const isValidPassword =
      existingUser.password ===
      createHash("sha256").update(password).digest("hex");
    if (!isValidPassword) {
      return res.status(401).json({
        errors: [{ message: "Invalid credentials, could not log you in." }],
      });
    }

    const token = jwt.sign(
      { userId: existingUser.id, privateNumber: existingUser.privateNumber },
      secretKey,
      { expiresIn: "168h" }
    );

    res.status(200).json({
      userId: existingUser.id,
      privateNumber: existingUser.privateNumber,
      token,
    });
  } catch (err: any) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ errors: [{ message: err.message }] });
    } else {
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error." }] });
    }
  }
};

// ************************************************************************************
// Functionality: Update user by ID.
// URL: http://localhost:5000/api/users/{user_id}
// EXAMPLE URL: http://localhost:5000/api/users/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: PATCH
// BODY:
// {
//     "privateNumber": "1234567",
//     "fullName": "full name",
//     "commandId": "38dd4929-d496-4df7-824d-3fa01a640ca3",
//     "editPerm": false,
//     "managePerm": true
// }
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: [{ message: "Failed to delete user, try later." }] });
  }
  const userId = req.params.userId;
  const { privateNumber, fullName, commandId, editPerm, managePerm } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ errors: [{ message: "Authorization header is missing." }] });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ message: "Token is missing." }] });
    }

    try {
      const decodedToken = jwt.verify(token, secretKey) as any;
      const userUpdatingUserId = decodedToken.userId;

      const userRequested = await User.findByPk(userUpdatingUserId);
      if (!userRequested || !userRequested.managePerm) {
        return res
          .status(403)
          .json({ errors: [{ message: "User is not authorized" }] });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(403).json({
          errors: [
            { message: `Could not update user ${userId}, user doesn't exist.` },
          ],
        });
      }

      const command = await Command.findByPk(userRequested.commandId);
      if (!command) {
        return res.status(403).json({
          errors: [
            {
              message: `Could not update user ${userId}, command ${userRequested.commandId} doesn't exist.`,
            },
          ],
        });
      }

      if (privateNumber !== undefined) user.privateNumber = privateNumber;
      if (fullName !== undefined) user.fullName = fullName;
      if (commandId !== undefined) user.commandId = commandId;
      if (editPerm !== undefined) user.editPerm = editPerm;
      if (managePerm !== undefined) user.managePerm = managePerm;

      await user.save();

      res.status(200).json(user);
    } catch (err: any) {
      res.status(422).json({
        errors: [
          {
            message: err.message,
            detail: err.detail,
            constraint: err.constraint,
            schema: err.schema,
            table: err.table,
          },
        ],
      });

      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// Functionality: Change a user's password by ID.
// URL:  http://localhost:5000/api/users/password/{userId}
// EXAMPLE URL: http://localhost:5000/api/users/password/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: POST
// BODY:
// {
//   "newPassword": "new_password",
// }
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const { newPassword } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ errors: [{ message: "Authorization header is missing." }] });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ message: "Token is missing." }] });
    }

    try {
      const decodedToken = jwt.verify(token, secretKey) as any;
      const userUpdatingUserId = decodedToken.userId;

      const userRequested = await User.findByPk(userUpdatingUserId);
      if (!userRequested || !userRequested.managePerm) {
        return res
          .status(403)
          .json({ errors: [{ message: "User is not authorized" }] });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(403).json({
          errors: [
            { message: `Could not update user ${userId}, user doesn't exist.` },
          ],
        });
      }

      const hashedPassword = createHash("sha256")
        .update(newPassword)
        .digest("hex");

      user.password = hashedPassword;
      await user.save();

      res.status(200).json(user);
    } catch (err: any) {
      res.status(422).json({
        errors: [
          {
            message: err.message,
            detail: err.detail,
            constraint: err.constraint,
            schema: err.schema,
            table: err.table,
          },
        ],
      });

      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// ************************************************************************************
// Functionality: Delete a user by ID.
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
      return res
        .status(422)
        .json({ errors: [{ message: "Failed to delete user, try later." }] });
    }

    const userId = req.params.userId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ errors: [{ message: "Authorization header is missing." }] });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ message: "Token is missing." }] });
    }

    try {
      const decodedToken = jwt.verify(token, secretKey) as any;
      const userUpdatingUserId = decodedToken.userId;

      const userRequested = await User.findByPk(userUpdatingUserId);
      if (!userRequested || !userRequested.managePerm) {
        return res
          .status(403)
          .json({ errors: [{ message: "User is not authorized" }] });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          errors: [
            {
              message: `Could not delete user ${userId}, user doesn't exist.`,
            },
          ],
        });
      }

      await user.destroy();

      res.status(200).json({ message: `User ${userId} deleted successfully.` });
    } catch (err: any) {
      res.status(422).json({
        errors: [
          {
            message: err.message,
            detail: err.detail,
            constraint: err.constraint,
            schema: err.schema,
            table: err.table,
          },
        ],
      });
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
