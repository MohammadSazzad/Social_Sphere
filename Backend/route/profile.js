import express from "express";
import { protectRoute } from "../auth/authCheck.js";
import { getUserProfileController } from "../controller/users.js";

const profileRouter = express.Router();

profileRouter.get("/:id", protectRoute, getUserProfileController);

// Update user profile by ID
// profileRouter.put("/:id", protectRoute, updateUserProfileController);

export default profileRouter;
