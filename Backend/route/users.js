import { getUsersController, signUpController, verifyUserController } from "../controller/users.js";
import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.post("/signup", signUpController);
usersRouter.post("/verify", verifyUserController);


export default usersRouter;