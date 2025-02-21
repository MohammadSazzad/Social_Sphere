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
        LEFT JOIN media m ON p.id = m.post_id
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

export const createPost = async ( user_id, content, privacy_setting, created_at, updated_at ) => {
    const result = await pool.query(`
        INSERT INTO posts (user_id, content, privacy_setting, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, [user_id, content, privacy_setting, created_at, updated_at]);
    return result.rows[0].id;
}

export const createMedia = async ( post_id, user_id, url, created_at ) => {
    const result = await pool.query(`
        INSERT INTO media (post_id, user_id, url, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [post_id, user_id, url, created_at]);
    return result.rows[0];
}