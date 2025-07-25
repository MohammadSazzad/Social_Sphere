import { getStoriesWithoutId, createStory, createStoryContent, getStoryById, getStories } from "../model/stories.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getStoriesController = async (req, res) => {
    try {
        const stories = await getStories();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStoriesWithoutIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const stories = await getStoriesWithoutId(id);
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStoryByIdController = async (req, res) => {
    try {
        const {id} = req.params;
        const story = await getStoryById(id);
        res.status(200).json(story);
    }catch ( error ) {
        res.status(500).json({ message: error.message });
    }
}

export const createStoryController = async (req, res) => {
    try {
        const { user_id, created_at, storyContent } = req.body;
        const userId = Number(user_id);
        let media = null;
        
        if (req.file) {
            const result = await uploadOnCloudinary(
                req.file.buffer, 
                req.file.originalname
            );
            
            if (!result || !result.url) {
                return res.status(500).json({ 
                    message: 'Failed to upload media to Cloudinary' 
                });
            }
            media = result.url;
        }
        const story = await createStory(userId, media, created_at, storyContent);
        res.status(201).json(story);
    }catch ( error ) {
        res.status(500).json({ message: error.message });
    }
}

export const createStoryContentController = async (req, res) => {
    try{
        const { user_id, created_at, storyContent } = req.body;
        const story = await createStoryContent(user_id, created_at, storyContent);
        res.status(201).json(story);
    }catch( error ) {
        res.status(500).json({ message: error.message });
    }
}