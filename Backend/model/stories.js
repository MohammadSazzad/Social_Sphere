import { pool } from '../config/db.js';

export const getStories = async () => {
    const result = await pool.query('SELECT * FROM stories');
    return result.rows;
}