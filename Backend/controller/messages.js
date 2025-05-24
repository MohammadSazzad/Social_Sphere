import { getRecieverSocketId } from "../config/socket.js";
import { createMessage, getMessages } from "../model/messages.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getMessagesController = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;
        const messages = await getMessages(userId, friendId);
        res.status(200).json( messages );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const createMessageController = async (req, res) => {
    try {
        const { content } = req.body;
        const friendId = req.params.id;
        const userId = req.user.id;
        const LocalFilePath = req.file.path;
        const is_read = req.body.is_read ? 
            req.body.is_read.toLowerCase() === 'true' : 
            false;

        const result = await uploadOnCloudinary(LocalFilePath);
        const media = result.url;

        const recieverSocketId = getRecieverSocketId(friendId);
        if (recieverSocketId) {
            req.io.to(recieverSocketId).emit("newMessage", {
                senderId: userId,
                content,
                media,
                is_read,
            });
        }
        
        const message = await createMessage(userId, friendId, content, is_read, media);
        res.status(200).json({ message });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });       
    }
}