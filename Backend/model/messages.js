import { pool } from "../config/db.js";

export const getMessages = async (userId, friendId) => {
    try {
        const result = await pool.query(
            `SELECT 
                m.*,
                u1.first_name as sender_first_name,
                u1.last_name as sender_last_name,
                u1.profile_picture_url as sender_profile_picture,
                u2.first_name as receiver_first_name,
                u2.last_name as receiver_last_name,
                u2.profile_picture_url as receiver_profile_picture
            FROM messages m
            LEFT JOIN users u1 ON m.sender_id = u1.id
            LEFT JOIN users u2 ON m.receiver_id = u2.id
            WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
               OR (m.sender_id = $2 AND m.receiver_id = $1) 
            ORDER BY m.created_at ASC`,
            [userId, friendId]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getMessages:', error);
        throw error;
    }
}

export const createMessage = async (userId, friendId, content, is_read, media_url) => {
    try {
        const result = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, content, is_read, media_url, created_at) 
             VALUES ($1, $2, $3, $4, $5, NOW()) 
             RETURNING *`,
            [userId, friendId, content, is_read, media_url]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error in createMessage:', error);
        throw error;
    }
}

export const markMessagesAsRead = async (userId, friendId) => {
    try {
        const result = await pool.query(
            `UPDATE messages 
             SET is_read = true 
             WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
             RETURNING *`,
            [friendId, userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in markMessagesAsRead:', error);
        throw error;
    }
}