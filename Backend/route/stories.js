import { getStoriesController } from "../controller/stories.js";
import express from "express";

const storiesRouter = express.Router();

storiesRouter.get("/", getStoriesController);

export default storiesRouter;