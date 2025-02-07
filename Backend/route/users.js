import { getUsersController } from "../controller/users.js";
import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);

export default usersRouter;