import { getAllPost } from "../model/posts.js";

export const getAllPostController = async (req, res) => {
    try{
        const posts = await getAllPost();
        res.status(200).json(posts);
    }catch( error ){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};