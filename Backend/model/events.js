import { pool } from "../config/db.js";

export const getEvents = async () => {
    const result = await pool.query('SELECT * FROM events');
    return result.rows;
};

export const getEventById = async (id) => {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
};

export const getRunningEvents = async (currentDate) => {
    const result = await pool.query('SELECT * FROM events WHERE start_time <= $1 AND end_time >= $1', [currentDate]);
    return result.rows;
};

export const getUpcomingEvents = async (currentDate) => {
    const result = await pool.query('SELECT * FROM events WHERE start_time > $1', [currentDate]);
    return result.rows;
};

export const createEvents = async (title, description, organizer_id, group_id, location, start_date, end_date) => {
    await pool.query('INSERT INTO events (title, description, organizer_id, group_id, location, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7)', [title, description, organizer_id, group_id, location, start_date, end_date]);
 }

 export const deleteEvent = async (id) => {
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
 }

export const updateEvent = async (id, title, description, organizer_id, group_id, location, start_date, end_date) => {
    await pool.query('UPDATE events SET title = $1, description = $2, organizer_id = $3, group_id = $4, location = $5, start_date = $6, end_date = $7 WHERE id = $8', [title, description, organizer_id, group_id, location, start_date, end_date, id]);
}