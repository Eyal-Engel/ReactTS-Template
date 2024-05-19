import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import User from "../models/schemas/User";
import Command from "../models/schemas/Command";
import { sha256 } from "js-sha256";
dotenv.config();

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({});
    res.json(users);
  } catch (err) {
    next(err);
  }
};

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

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Invalid inputs passed, please check your data.");
    (error as any).statusCode = 422;
    return next(error);
  }
  const id = uuidv4();

  const { privateNumber, fullName, password, commandId, editPerm, managePerm } =
    req.body.creditentials;
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

    const hashedPassword = await sha256(password);
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

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { privateNumber, password } = req.body;
  const secretKey = process.env.SECRET_KEY;

  try {
    const hashedPassword = await sha256(password);
    const existingUser = await User.findOne({
      where: { privateNumber, password: hashedPassword },
    });

    if (!existingUser) {
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

    const hashedPassword = await sha256(newPassword);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: `User ${userId} updated successfully.`, user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("failed to delete user, try later.");
      (error as any).statusCode = 422;
      throw error;
    }

    const userId = req.params.userId;
    const { userUpdatingUserId } = req.body;

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
          `Could not delete user ${userId}, user doesn't exist.`
        );
        (error as any).statusCode = 404;
        throw error;
      }

      await user.destroy();

      res.status(200).json({ message: `User ${userId} deleted successfully.` });
    } catch (err) {
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
