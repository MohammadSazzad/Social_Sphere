import { createStoryContentController, createStoryController, getStoriesWithoutIdController, getStoryByIdController, getStoriesController } from "../controller/stories.js";
import { upload } from "../auth/multer.js";
import express from "express";

const storiesRouter = express.Router();

storiesRouter.get("/", getStoriesController);
storiesRouter.get("/:id", getStoriesWithoutIdController);
storiesRouter.get("/show/:id", getStoryByIdController);
storiesRouter.post("/create", upload.single('file'), createStoryController);
storiesRouter.post("/createContent", createStoryContentController);

export default storiesRouter;