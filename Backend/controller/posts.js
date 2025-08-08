import { createMedia, createPost, deleteMedia, deletePost, getAllPost, getUserIdByPostId, updatePost, updateMedia } from "../model/posts.js";
import moderationService from "../services/moderationService.js";
import imageModerationService from "../services/imageModerationService.js";
import FallbackImageModerationService from "../services/fallbackImageModerationService.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

// Create instance of fallback service
const fallbackImageModerationService = new FallbackImageModerationService();

function hasValidImageHeader(header) {
    const signatures = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        gif: [0x47, 0x49, 0x46, 0x38],
        webp: [0x52, 0x49, 0x46, 0x46],
    };

    for (const [format, signature] of Object.entries(signatures)) {
        let matches = true;
        for (let i = 0; i < signature.length; i++) {
            if (header[i] !== signature[i]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return true;
        }
    }
    
    return false;
}

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
        
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: "Content is required" });
        }

        // Text moderation
        const isAdultText = await moderationService.isAdultContent(content);
        if (isAdultText) {
            return res.status(400).json({
                error: "Post rejected: Contains prohibited text content"
            });
        }

        let mediaUrl = null;
        if (req.file) {
            try {
                
                let isAdultImage = false;
                let moderationMethod = "unknown";
                
                try {
                    isAdultImage = await imageModerationService.isAdultContent(req.file.buffer);
                    moderationMethod = "Azure Vision";
                    
                    // If Azure returns false but we know it's failing (403 errors), use fallback
                    if (!isAdultImage) {
                        try {
                            const fallbackResult = await fallbackImageModerationService.isAdultContent(req.file.buffer);
                            if (fallbackResult) {
                                isAdultImage = true;
                                moderationMethod = "Fallback Service (Override)";
                            } else {
                                moderationMethod = "Azure + Fallback Verification";
                            }
                        } catch (fallbackError) {
                            console.warn('Fallback verification failed:', fallbackError.message);
                            // Keep Azure result if fallback fails
                        }
                    }
                } catch (azureError) {
                    console.warn('Azure moderation failed, using fallback service:', azureError.message);
                    
                    try {
                        isAdultImage = await fallbackImageModerationService.isAdultContent(req.file.buffer);
                        moderationMethod = "Fallback Service";
                    } catch (fallbackError) {
                        console.error('Both moderation services failed:', fallbackError.message);
                        isAdultImage = true;
                        moderationMethod = "Emergency Block";
                    }
                }

                if (isAdultImage) {
                    return res.status(400).json({
                        error: "Post rejected: Image contains prohibited content"
                    });
                }

                const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
                mediaUrl = result.url;
            } catch (uploadError) {
                console.error('Media processing error:', uploadError);
                return res.status(500).json({
                    error: "Media upload failed"
                });
            }
        }

        // Create post
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
};

export const deletePostController = async (req, res) => {
    try {
        const { post_id, user_id } = req.params;
        const userId = req.user.id;
        if(user_id != userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const userIdFromPost = await getUserIdByPostId(post_id);
        if (userIdFromPost !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        const deletedPost = await deletePost(post_id, userId);
        
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        const deletedMedia = await deleteMedia(post_id, userId);

        res.status(200).json({ 
            message: "Post deleted successfully",
            post_id: deletedPost.id 
        });
    }catch (error) {
        console.error('Post deletion error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

export const updatePostController = async (req, res) => {
    try {
        const { post_id, user_id, content } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!post_id) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return res.status(400).json({ error: "Content is required" });
        }

        // Authorization checks
        if (user_id && user_id != userId) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        const userIdFromPost = await getUserIdByPostId(post_id);
        if (userIdFromPost !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        // Text moderation
        const isAdultText = await moderationService.isAdultContent(content);
        if (isAdultText) {
            return res.status(400).json({
                error: "Post rejected: Contains prohibited content"
            });
        }

        // Update post content
        const updatedAt = new Date();
        await updatePost(post_id, userId, content, updatedAt);

        let mediaUrl = null;
        // Handle media update if file is provided
        if (req.file) {
            try {
                
                let isAdultImage = false;
                let moderationMethod = "unknown";
                
                try {
                    isAdultImage = await imageModerationService.isAdultContent(req.file.buffer);
                    moderationMethod = "Azure Vision";
                    
                    // If Azure returns false but we know it's failing (403 errors), use fallback
                    if (!isAdultImage) {
                        try {
                            const fallbackResult = await fallbackImageModerationService.isAdultContent(req.file.buffer);
                            if (fallbackResult) {
                                isAdultImage = true;
                                moderationMethod = "Fallback Service (Override)";
                            } else {
                                moderationMethod = "Azure + Fallback Verification";
                            }
                        } catch (fallbackError) {
                            console.warn('Fallback verification failed:', fallbackError.message);
                            // Keep Azure result if fallback fails
                        }
                    }
                } catch (azureError) {
                    console.warn('Azure moderation failed, using fallback service:', azureError.message);
                    
                    try {
                        isAdultImage = await fallbackImageModerationService.isAdultContent(req.file.buffer);
                        moderationMethod = "Fallback Service";
                    } catch (fallbackError) {
                        console.error('Both moderation services failed:', fallbackError.message);
                        isAdultImage = true;
                        moderationMethod = "Emergency Block";
                    }
                }

                if (isAdultImage) {
                    return res.status(400).json({
                        error: "Post rejected: Image contains prohibited content"
                    });
                }

                const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
                mediaUrl = result.url;

                // Update or create media record
                try {
                    await updateMedia(post_id, userId, mediaUrl, updatedAt);
                } catch (mediaUpdateError) {
                    // If update fails, try to create new media record
                    await createMedia(post_id, userId, mediaUrl, updatedAt);
                }

            } catch (uploadError) {
                console.error('Media processing error:', uploadError);
                return res.status(500).json({
                    error: "Media upload failed"
                });
            }
        }

        res.status(200).json({
            message: "Post updated successfully",
            post_id: post_id,
            mediaUrl: mediaUrl
        });

    } catch (error) {
        console.error('Post update error:', error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
}