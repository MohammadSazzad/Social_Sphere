import { upload } from "../auth/multer.js";
import { createPostController, deletePostController, getAllPostController, updatePostController } from "../controller/posts.js";
import express from "express";
import imageModerationService from "../services/imageModerationService.js";
import fallbackImageModerationService from "../services/fallbackImageModerationService.js";
import { protectRoute } from "../auth/authCheck.js";

const postsRouter = express.Router();

postsRouter.get("/", getAllPostController);
postsRouter.post("/create", upload.single('file'), createPostController);
postsRouter.delete("/delete/:post_id/:user_id", protectRoute, deletePostController);
postsRouter.put("/update", protectRoute, upload.single('file'), updatePostController)

// Test endpoint for image moderation
postsRouter.post("/test-moderation", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        let isAdult = false;
        let method = "unknown";
        
        try {
            isAdult = await imageModerationService.isAdultContent(req.file.buffer);
            method = "Azure Vision";
        } catch (azureError) {
            isAdult = await fallbackImageModerationService.isAdultContent(req.file.buffer);
            method = "Fallback Service";
        }
        
        res.json({
            filename: req.file.originalname,
            size: req.file.size,
            isAdultContent: isAdult,
            method: method,
            message: isAdult ? "Content flagged as adult" : "Content passed moderation"
        });
    } catch (error) {
        console.error("Test moderation error:", error);
        res.status(500).json({ error: "Test failed", details: error.message });
    }
});

export default postsRouter;