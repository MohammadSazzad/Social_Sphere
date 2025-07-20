import { upload } from "../auth/multer.js";
import { createPostController, getAllPostController } from "../controller/posts.js";
import express from "express";
import imageModerationService from "../services/imageModerationService.js";
import fallbackImageModerationService from "../services/fallbackImageModerationService.js";

const postsRouter = express.Router();

postsRouter.get("/", getAllPostController);
postsRouter.post("/create", upload.single('file'), createPostController);

// Test endpoint for image moderation
postsRouter.post("/test-moderation", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }
        
        console.log("Testing image moderation...");
        
        let isAdult = false;
        let method = "unknown";
        
        try {
            isAdult = await imageModerationService.isAdultContent(req.file.buffer);
            method = "Azure Vision";
        } catch (azureError) {
            console.log("Azure failed, trying fallback service...");
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