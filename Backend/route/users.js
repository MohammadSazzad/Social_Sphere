import { protectRoute } from "../auth/authCheck.js";
import { upload } from "../auth/multer.js";
import { getUsersController, signUpController, verifyUserController, loginController, uploadImageController, logoutController, authCheckController, getUserProfileController } from "../controller/users.js"; 

import express from "express";

const usersRouter = express.Router();

usersRouter.get("/", getUsersController);
usersRouter.post("/signup", signUpController);
usersRouter.post("/verify", verifyUserController);
usersRouter.post("/login", loginController);
usersRouter.post("/upload/:id", upload.single('file'), uploadImageController);
usersRouter.post("/logout", logoutController);
usersRouter.get("/check", protectRoute, authCheckController);
usersRouter.get("/profile/:id", protectRoute, getUserProfileController);  // ✅ Define the profile route here

export default usersRouter;
