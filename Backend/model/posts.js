import { pool } from "../config/db.js";

export const getAllPost = async () => {
    const result = await pool.query(`
        SELECT 
            p.id AS post_id, 
            u.profile_picture_url, 
            u.first_name, 
            u.last_name, 
            p.created_at, 
            p.updated_at, 
            p.content, 
            m.url AS media_url, 
            COUNT(DISTINCT r.id) AS reaction_count, 
            COUNT(DISTINCT c.id) AS comment_count 
        FROM posts p 
        JOIN users u ON p.user_id = u.id
        LEFT JOIN media m ON p.id = m.id
        LEFT JOIN reactions r ON r.likeable_type = 'post' AND r.post_id = p.id
        LEFT JOIN comments c ON c.post_id = p.id
        LEFT JOIN friends f ON 
            (f.friend_id = p.user_id AND f.status = 'accepted') OR 
            (f.user_id = p.user_id AND f.status = 'accepted')
        WHERE 
            p.privacy_setting = 'public' OR
            (p.privacy_setting = 'friends' AND (f.user_id IS NOT NULL OR f.friend_id IS NOT NULL))
        GROUP BY 
            p.id, 
            u.profile_picture_url, 
            u.first_name, 
            u.last_name, 
            p.created_at, 
            p.updated_at, 
            p.content,
            m.url
        ORDER BY p.created_at DESC`);
    return result.rows;
};