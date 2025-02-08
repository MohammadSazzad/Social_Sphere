import { getUsersController, signUpController } from "../controller/users.js";
import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.post("/signup", signUpController);

export default usersRouter;