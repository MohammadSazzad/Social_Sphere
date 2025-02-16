import { getStories } from "../model/stories.js";

export const getStoriesController = async (req, res) => {
    try {
        const stories = await getStories();
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}