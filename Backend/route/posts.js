import { getAllPostController } from "../controller/posts.js";
import express from "express";

const postsRouter = express.Router();

postsRouter.get("/", getAllPostController);

export default postsRouter;