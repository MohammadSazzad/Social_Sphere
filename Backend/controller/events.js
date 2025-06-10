import { getEvents, getRunningEvents, getUpcomingEvents, getEventById, createEvents, deleteEvent, updateEvent } from "../model/events.js";

export const getEventsController = async (req, res) => {
    try {
        const events = await getEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRunningEventsController = async (req, res) => {
    try {
        const currentDate = new Date();
        const runningEvents = await getRunningEvents(currentDate);
        res.status(200).json(runningEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUpcomingEventsController = async (req, res) => {
    try {
        const currentDate = new Date();
        const upcomingEvents = await getUpcomingEvents(currentDate);
        res.status(200).json(upcomingEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEventByIdController = async (req, res) => {
    try {
        const event = await getEventById(req.params.id);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createEventsController = async (req, res) => {
    try {
        const { title, description, organizer_id, group_id, location, start_date, end_date } = req.body;
        await createEvents(title, description, organizer_id, group_id, location, start_date, end_date);
        res.status(201).json({ message: "Event Created Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteEventController = async (req, res) => {
    try {
        await deleteEvent(req.params.id);
        res.status(200).json({ message: "Event Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateEventController = async (req, res) => {
    try {
        const { title, description, organizer_id, group_id, location, start_date, end_date } = req.body;
        await updateEvent(req.params.id, title, description, organizer_id, group_id, location, start_date, end_date);
        res.status(200).json({ message: "Event Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}