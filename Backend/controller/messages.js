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
        const is_read = req.body.is_read ? 
            req.body.is_read.toLowerCase() === 'true' : 
            false;

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

        if (!content && !media) {
            return res.status(400).json({
                message: 'Message must contain text or media'
            });
        }

        
        const message = await createMessage(
            userId, 
            friendId, 
            content, 
            is_read, 
            media
        );

        const recieverSocketId = getRecieverSocketId(friendId);
        if (recieverSocketId) {
            req.io.to(recieverSocketId).emit("newMessage", {
                senderId: userId,
                content,
                media,
                is_read,
            });
        }

        res.status(201).json({ message });
        
    } catch (error) {
        console.error('Message creation error:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });       
    }
}