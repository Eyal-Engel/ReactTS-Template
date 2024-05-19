import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import Command from "../models/schemas/Command";
import User from "../models/schemas/User";

// Get all commands
export const getAllCommands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch commands where isNewSource is true
    const trueCommands = await Command.findAll({
      where: {
        isNewSource: true,
      },
      order: [
        ["commandName", "ASC"], // Sort by commandName in ascending order
      ],
    });

    // Fetch commands where isNewSource is false
    const falseCommands = await Command.findAll({
      where: {
        isNewSource: false,
      },
      order: [
        ["commandName", "ASC"], // Sort by commandName in ascending order
      ],
    });

    // Combine the results
    const commands = [...trueCommands, ...falseCommands];

    res.json(commands);
  } catch (err) {
    return next(err);
  }
};

// Get a specific command by id
export const getCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.commandId;
  try {
    const command = await Command.findByPk(id);
    if (!command) {
      return next(new Error(`Command with id ${id} not found.`));
    }
    res.json(command);
  } catch (err) {
    return next(err);
  }
};

// Post new command
export const createCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commandName, userId, isNewSource } = req.body;

  const id = uuidv4();
  try {
    const user = await User.findByPk(userId);
    const managePerm = user?.managePerm;

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist" }] } });
    }

    if (!managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const trimmedName = commandName
      .trim()
      .replace(/'/g, "׳")
      .replace(/"/g, "״");

    const newCommand = await Command.create({
      id,
      commandName: trimmedName,
      isNewSource,
    });

    res.status(201).json({ newCommand });
  } catch (err) {
    return next(err);
  }
};

// Patch a command by id
export const updateCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commandName, userId } = req.body;
  const id = req.params.commandId;

  try {
    const user = await User.findByPk(userId);
    const managePerm = user?.managePerm;

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist" }] } });
    }

    if (!managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const command = await Command.findByPk(id);

    if (!command?.isNewSource) {
      return next(new Error("You do not have access to edit this graveyard."));
    }

    command.commandName = commandName;
    await command.save();

    res.json(command);
  } catch (err) {
    return next(err);
  }
};

// Delete command by id
export const deleteCommandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.commandId;
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const managePerm = user?.managePerm;

    if (!user) {
      return res
        .status(404)
        .json({ body: { errors: [{ message: "User does not exist" }] } });
    }

    if (!managePerm) {
      return res
        .status(403)
        .json({ body: { errors: [{ message: "User is not authorized" }] } });
    }

    const command = await Command.findByPk(id);

    if (!command?.isNewSource) {
      return next(
        new Error("You do not have access to delete this graveyard.")
      );
    }

    // Check if there are any associated NifgaimHalal or NifgaimUser
    // const associatedUsers = await command.countUsers();

    // if (associatedUsers > 0) {
    //   return res.status(404).json({
    //     body: {
    //       errors: [
    //         { message: "Cannot delete command with associated NifgaimUser" },
    //       ],
    //     },
    //   });
    // }

    await command.destroy();
    res.status(204).end();
  } catch (err) {
    return next(err);
  }
};
