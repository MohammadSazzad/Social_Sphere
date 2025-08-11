import express from "express";
import { protectRoute } from "../auth/authCheck.js";
import { upload } from "../auth/multer.js";
import {
  getUsersController,
  signUpController,
  verifyUserController,
  loginController,
  uploadImageController,
  logoutController,
  authCheckController,
  getUserByIdController,
  getUserPostsController,
} from "../controller/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.post("/signup", signUpController);
usersRouter.post("/verify", verifyUserController);
usersRouter.post("/login", loginController);
usersRouter.post("/logout", protectRoute, logoutController);
usersRouter.get("/friendProfile/:id", getUserByIdController);
usersRouter.post("/upload/:id", upload.single("file"), uploadImageController);
usersRouter.get("/check", protectRoute, authCheckController);
usersRouter.get("/post/:userId", protectRoute, getUserPostsController);


export default usersRouter;