import { upload } from "../auth/multer.js";
import { createPostController, getAllPostController } from "../controller/posts.js";
import express from "express";

const postsRouter = express.Router();

postsRouter.get("/", getAllPostController);
postsRouter.post("/create", upload.single('file'), createPostController);

export default postsRouter;