import express from "express";
import * as commandsController from "../controllers/commandControllers";
import checkAuth from "../middlewares/checkAuth";
import cacheMiddleware from "../middlewares/cacheMiddleware";

const router = express.Router();

// Cache for 1 hour
router.get("/", cacheMiddleware(3600), commandsController.getAllCommands);

// Cache for 30 minutes
router.get(
  "/:commandId",
  cacheMiddleware(1800),
  commandsController.getCommandById
);

router.use(checkAuth);

router.post("/", commandsController.createCommand);
router.patch("/:commandId", commandsController.updateCommandById);
router.delete("/:commandId", commandsController.deleteCommandById);

export default router;
