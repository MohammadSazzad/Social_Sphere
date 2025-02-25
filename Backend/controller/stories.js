import { getStories, createStory, createStoryContent } from "../model/stories.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getStoriesController = async (req, res) => {
    try {
        const stories = await getStories();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createStoryController = async (req, res) => {
    try {
        const { user_id, created_at, storyContent } = req.body;
        const userId = Number(user_id);
        const LocalFilePath = req.file.path;
        const result = await uploadOnCloudinary (LocalFilePath);
        const media_url = result.secure_url; 
        const story = await createStory(userId, media_url, created_at, storyContent);
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