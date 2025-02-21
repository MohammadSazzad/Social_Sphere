import { createMedia, createPost, getAllPost } from "../model/posts.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getAllPostController = async (req, res) => {
    try{
        const posts = await getAllPost();
        res.status(200).json(posts);
    }catch( error ){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const createPostController = async (req, res) => {
    try {
        const { user_id, content, privacy_setting, created_at, updated_at } = req.body;
        const LocalFilePath = req.file.path;
        const result = await uploadOnCloudinary(LocalFilePath);
        const userId = Number(user_id);
        const createdAt = new Date(created_at);
        const updatedAt = new Date(updated_at);
        const post_id = await createPost(userId, content, privacy_setting, createdAt, updatedAt);
        await createMedia(post_id, userId, result.url, createdAt);
        console.log(post_id);
        res.status(200).json({message: "Post Created"});
    }catch( error ){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}