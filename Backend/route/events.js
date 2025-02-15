import { getEventsController, getRunningEventsController, getUpcomingEventsController, getEventByIdController, createEventsController, deleteEventController, updateEventController } from "../controller/events.js";
import express from "express";

const eventsRouter = express.Router();

eventsRouter.get("/", getEventsController);
eventsRouter.get("/running", getRunningEventsController);
eventsRouter.get("/upcoming", getUpcomingEventsController);
eventsRouter.get("/:id", getEventByIdController);
eventsRouter.post("/create", createEventsController);
eventsRouter.delete("/delete/:id", deleteEventController);
eventsRouter.put("update/:id", updateEventController);

export default eventsRouter;