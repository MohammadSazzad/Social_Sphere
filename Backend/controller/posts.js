import { createMedia, createPost, getAllPost } from "../model/posts.js";
import moderationService from "../services/moderationService.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getAllPostController = async (req, res) => {
    try {
        const posts = await getAllPost();
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createPostController = async (req, res) => {
    try {
        const { user_id, content, privacy_setting } = req.body;
        
        // Validate content exists
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: "Content is required" });
        }

        // Content moderation
        const isAdultContent = await moderationService.isAdultContent(content);
        if (isAdultContent) {
            return res.status(400).json({
                error: "Post rejected: Contains prohibited content"
            });
        }

        // Handle media upload if exists
        let mediaUrl = null;
        if (req.file) {
            try {
                const result = await uploadOnCloudinary(req.file.path);
                mediaUrl = result.url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    error: "Media upload failed"
                });
            }
        }

        const userId = Number(user_id);
        const now = new Date();
        
        const post_id = await createPost(userId, content, privacy_setting, now, now);
        
        if (mediaUrl) {
            await createMedia(post_id, userId, mediaUrl, now);
        }
        
        res.status(201).json({ 
            message: "Post created successfully",
            post_id
        });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
}