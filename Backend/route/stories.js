import { createStoryContentController, createStoryController, getStoriesController } from "../controller/stories.js";
import { upload } from "../auth/multer.js";
import express from "express";

const storiesRouter = express.Router();

storiesRouter.get("/", getStoriesController);
storiesRouter.post("/create", upload.single('file'), createStoryController);
storiesRouter.post("/createContent", createStoryContentController);

export default storiesRouter;