import { pool } from "../config/db.js";

export const getMessages = async (userId, friendId) => {
    const result = await pool.query(
        `SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC`,
        [userId, friendId]
    );
    return result.rows;
}

export const createMessage = async (userId, friendId, content, is_read, media_url) => {
    const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content, is_read, media_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, friendId, content, is_read, media_url]
    );
    return result.rows[0];
}