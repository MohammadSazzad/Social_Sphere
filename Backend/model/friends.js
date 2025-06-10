import { pool } from '../config/db.js';

export const getFriendsOfUser = async (userId) => {
    const result = await pool.query(
      `SELECT u.id, u. profile_picture_url, u.first_name, u.last_name
	   FROM users u 
	   JOIN friends f ON u.id = f.user_id
	   WHERE f.friend_id = $1`,
      [userId]
    );
    return result.rows;
  }
  