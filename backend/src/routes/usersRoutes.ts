import express from "express";
import * as usersController from "../controllers/usersControllers";
import checkAuth from "../middlewares/checkAuth";

const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/:userId", usersController.getUserById);

router.post("/login", usersController.login);

// router.use(checkAuth);

router.post("/signup", usersController.signup);

router.patch("/:userId", usersController.updateUser);

router.patch("/password/:userId", usersController.changePassword);

router.delete("/:userId", usersController.deleteUser);

export default router;
