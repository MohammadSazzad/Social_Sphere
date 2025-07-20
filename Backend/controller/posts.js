import { createMedia, createPost, getAllPost } from "../model/posts.js";
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
            console.log(`Detected valid ${format} image`);
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
                console.log(`Processing image: ${req.file.originalname}, size: ${req.file.size} bytes`);
                
                let isAdultImage = false;
                let moderationMethod = "unknown";
                
                try {
                    console.log('Attempting Azure image moderation...');
                    isAdultImage = await imageModerationService.isAdultContent(req.file.buffer);
                    moderationMethod = "Azure Vision";
                    console.log('Azure moderation result:', isAdultImage);
                    
                    // If Azure returns false but we know it's failing (403 errors), use fallback
                    if (!isAdultImage) {
                        console.log('Azure returned false - attempting fallback analysis for verification...');
                        try {
                            const fallbackResult = await fallbackImageModerationService.isAdultContent(req.file.buffer);
                            if (fallbackResult) {
                                isAdultImage = true;
                                moderationMethod = "Fallback Service (Override)";
                                console.log('Fallback detected adult content that Azure missed');
                            } else {
                                moderationMethod = "Azure + Fallback Verification";
                                console.log('Both Azure and Fallback agree: content is safe');
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
                        console.log('Fallback moderation result:', isAdultImage);
                    } catch (fallbackError) {
                        console.error('Both moderation services failed:', fallbackError.message);
                        isAdultImage = true;
                        moderationMethod = "Emergency Block";
                    }
                }
                
                console.log(`Final moderation decision: ${isAdultImage ? 'BLOCKED' : 'ALLOWED'} (Method: ${moderationMethod})`);
                
                if (isAdultImage) {
                    console.log('Image rejected due to adult content');
                    return res.status(400).json({
                        error: "Post rejected: Image contains prohibited content"
                    });
                }

                console.log('Image passed moderation, uploading to Cloudinary...');
                const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
                mediaUrl = result.url;
                console.log('Image uploaded successfully to Cloudinary');
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