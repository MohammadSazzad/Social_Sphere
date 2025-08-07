import { getRecieverSocketId } from "../config/socket.js";
import { createMessage, getMessages } from "../model/messages.js";
import uploadOnCloudinary from "../utility/cloudinary.js";

export const getMessagesController = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;
        if (!friendId || isNaN(friendId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid friend ID' 
            });
        }

        const messages = await getMessages(userId, friendId);
        
        res.status(200).json({
            success: true,
            data: messages,
            count: messages.length
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to retrieve messages',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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

        if (!friendId || isNaN(friendId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid friend ID'
            });
        }

        let media = null;
        
        if (req.file) {
            try {
                const result = await uploadOnCloudinary(
                    req.file.buffer, 
                    req.file.originalname
                );
                
                if (!result || !result.url) {
                    return res.status(500).json({ 
                        success: false,
                        message: 'Failed to upload media to Cloudinary' 
                    });
                }
                media = result.url;
            } catch (uploadError) {
                console.error('Media upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Media upload failed'
                });
            }
        }

        if (!content && !media) {
            return res.status(400).json({
                success: false,
                message: 'Message must contain text or media'
            });
        }

        const message = await createMessage(
            userId, 
            friendId, 
            content || '', 
            is_read, 
            media
        );

        const recieverSocketId = getRecieverSocketId(friendId);
        if (recieverSocketId) {
            req.io.to(recieverSocketId).emit("newMessage", {
                id: message.id,
                senderId: userId,
                receiverId: friendId,
                content: content || '',
                media_url: media,
                is_read,
                created_at: message.created_at,
                sender_name: req.user.first_name + ' ' + req.user.last_name
            });
        }

        res.status(201).json({ 
            success: true,
            data: message,
            message: 'Message sent successfully'
        });
        
    } catch (error) {
        console.error('Message creation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to send message',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });       
    }
}