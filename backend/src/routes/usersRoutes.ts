import express from "express";
import * as usersController from "../controllers/usersControllers";
import checkAuth from "../middlewares/checkAuth";

const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/:userId", usersController.getUserById);

router.post("/login", usersController.login);
router.post("/signup", usersController.signup);
router.use(checkAuth);



router.patch("/:userId", usersController.updateUser);

router.patch("/password/:userId", usersController.changePassword);

router.delete("/:userId", usersController.deleteUser);

export default router;
