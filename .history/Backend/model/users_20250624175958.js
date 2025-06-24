import { pool } from '../config/db.js';

export const getUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const signUp = async (username, first_name, last_name, date_of_birth, gender, email, password_hash) => {
  await pool.query(
    'INSERT INTO users (username, first_name, last_name, date_of_birth, gender, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [username, first_name, last_name, date_of_birth, gender, email, password_hash]
  );
};

export const verifyUser = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};

export const uploadImage = async (id, profile_picture_url) => {
  const result = await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [profile_picture_url, id]);
  return result.rows[0];
};
//  export const getUserById = async(userId) => {
//     const result = await pool.query('GET * FROM users u WHERE u.id = $1', [userId]);
//     return result.rows[0];
//  }

 export const getUserPosts = async(userId) => {
    const result = await pool.query('GET * FROM users WHERE id = &1', [userId]);
    return result.rows[0];
 }

 export const uploadImage = async (id, profile_picture_url) => {
    const result = await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [profile_picture_url, id]);
    return result.rows[0];
 }
 
