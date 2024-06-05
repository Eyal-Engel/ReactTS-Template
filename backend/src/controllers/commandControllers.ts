import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import Command from "../models/schemas/Command";
import User from "../models/schemas/User";
import redisClient from "../redisClient"; // Import redis client

dotenv.config();

const secretKey = process.env.SECRET_KEY as jwt.Secret;

if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in the environment variables");
}

// ************************************************************************************
// Functionality: Get all commands.
// URL: http://localhost:5000/api/commands
// METHOD: GET
// ************************************************************************************
const getAllCommands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: [{ message: "Failed to delete user, try later." }] });
    }

    const trueCommands = await Command.findAll({
      where: {
        isNewSource: true,
      },
      order: [["name", "ASC"]],
    });

    const falseCommands = await Command.findAll({
      where: {
        isNewSource: false,
      },
      order: [["name", "ASC"]],
    });

    const commands = [...trueCommands, ...falseCommands];

    // Cache the combined results
    redisClient.setEx(req.originalUrl, 3600, JSON.stringify(commands));

    res.status(200).json(commands);
  } catch (err) {
    return next(err);
  }
};

// ************************************************************************************
// Functionality: Get a command by ID.
// URL: http://localhost:5000/api/commands/{command_id}
// EXAMPLE URL: http://localhost:5000/api/commands/c0e670a0-918b-4f91-9a62-d6b0460c9752
// METHOD: GET
// ************************************************************************************
const getCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: [{ message: "Failed to delete user, try later." }] });
  }
  const commandId = req.params.commandId;
  try {
    const command = await Command.findByPk(commandId);
    if (!command) {
      return res.status(404).json({
        errors: [{ message: `Command with ID ${commandId} not found.` }],
      });
    }

    // Cache the result
    redisClient.setEx(req.originalUrl, 3600, JSON.stringify(command));

    res.status(200).json(command);
  } catch (err) {
    return next(err);
  }
};

// ************************************************************************************
// Functionality: Create a new command.
// URL: http://localhost:5000/api/commands
// METHOD: POST
// BODY:
// {
//     "name": "command name",
//     "isNewSource": true/false
// }
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const createCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: [{ message: "Invalid inputs passed, please check your data." }],
    });
  }
  const { name, isNewSource } = req.body;
  const id = uuidv4();

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

      const trimmedName = name.trim().replace(/'/g, "׳").replace(/"/g, "״");

      const newCommand = await Command.create({
        id,
        name: trimmedName,
        isNewSource,
      });

      // Invalidate cache for the command list
      redisClient.del("/api/commands");

      res.status(201).json(newCommand);
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
    return next(err);
  }
};

// ************************************************************************************
// Functionality: Update a command by ID, allowing modification of its name.
// URL: http://localhost:5000/api/commands/{command_id}
// EXAMPLE URL: http://localhost:5000/api/commands/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: PATCH
// BODY:
// {
//     "name": "command name"
// }
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const updateCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: [{ message: "Failed to delete user, try later." }] });
  }
  const { name } = req.body;
  const id = req.params.commandId;

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
      const command = await Command.findByPk(id);

      if (!command?.isNewSource) {
        return next(
          new Error(
            "You do not have access to edit this command(original command)."
          )
        );
      }

      command.name = name;
      await command.save();

      // Invalidate cache for the updated command
      redisClient.del(`/api/commands/${id}`);
      // Invalidate cache for the command list
      redisClient.del("/api/commands");

      res.status(200).json(command);
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
    return next(err);
  }
};

// ************************************************************************************
// Functionality: Delete a command by ID.
// URL: http://localhost:5000/api/commands/{command_id}
// EXAMPLE URL: http://localhost:5000/api/commands/12e827cf-bdc8-4584-8c63-e67c338a8071
// METHOD: DELETE
// HEADERS:
// Authorization: Bearer {TOKEN}
// ************************************************************************************
const deleteCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: [{ message: "Failed to delete user, try later." }] });
  }
  const id = req.params.commandId;

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

      const command = await Command.findByPk(id);

      if (!command?.isNewSource) {
        return next(
          new Error("You do not have access to delete this commands.")
        );
      }

      await command.destroy();

      // Invalidate cache for the deleted command
      redisClient.del(`/api/commands/${id}`);
      // Invalidate cache for the command list
      redisClient.del("/api/commands");

      res.status(204).json({ message: `Command ${id} deleted successfully.` });
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
    return next(err);
  }
};

export {
  getAllCommands,
  getCommandById,
  createCommand,
  updateCommandById,
  deleteCommandById,
};
