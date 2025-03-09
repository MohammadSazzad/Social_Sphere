import { pool } from '../config/db.js';

export const getStoriesWithoutId = async (id) => {
    const result = await pool.query(`
        SELECT  
        s.id, 
        s.media_url, 
        s.created_at, 
        s.expires_at, 
        s.storyContent, 
        u.first_name, 
        u.last_name, 
        u.profile_picture_url
        FROM stories s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id != $1
        ORDER BY s.created_at DESC`, [id]);
    return result.rows;
}

export const getStories = async () => {
    const result = await pool.query(`
        SELECT 
        s.id, 
        s.media_url, 
        s.created_at, 
        s.expires_at, 
        s.storyContent, 
        u.first_name, 
        u.last_name, 
        u.profile_picture_url
        FROM stories s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC`);
    return result.rows;
}

export const getStoryById = async (id) => {
    const result = await pool.query(`
        SELECT  
        s.id, 
        s.media_url, 
        s.created_at, 
        s.expires_at, 
        s.storyContent, 
        u.first_name, 
        u.last_name, 
        u.profile_picture_url
        FROM stories s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1`, [id]);
    return result.rows[0];
}

export const createStory = async (user_id, media_url, created_at, storyContent) => {
    const result = await pool.query('INSERT INTO stories (user_id, media_url, created_at, storyContent) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, media_url, created_at, storyContent]);
    return result.rows[0];
};

export const createStoryContent = async (user_id, created_at, storyContent) => {
    const result = await pool.query('INSERT INTO stories (user_id, created_at, storyContent) VALUES ($1, $2, $3) RETURNING *', [user_id, created_at, storyContent]);
    return result.rows[0];
}
