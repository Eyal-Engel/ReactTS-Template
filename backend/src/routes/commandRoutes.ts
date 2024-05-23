import express from "express";
import { Request, Response, NextFunction } from "express";

import * as commandsController from "../controllers/commandControllers";
import checkAuth from "../middlewares/checkAuth";

const router = express.Router();

router.get("/", commandsController.getAllCommands);

router.get("/:commandId", commandsController.getCommandById);

router.use(checkAuth);

router.post("/", commandsController.createCommand);

router.patch("/:commandId", commandsController.updateCommandById);

router.delete("/:commandId", commandsController.deleteCommandById);

export default router;
