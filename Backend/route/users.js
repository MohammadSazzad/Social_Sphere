import { upload } from "../auth/multer.js";
import { getUsersController, signUpController, verifyUserController, loginController, uploadImageController } from "../controller/users.js";
import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.post("/signup", signUpController);
usersRouter.post("/verify", verifyUserController);
usersRouter.post("/login", loginController);
usersRouter.post("/upload/:id", upload.single('file'), uploadImageController);



export default usersRouter;