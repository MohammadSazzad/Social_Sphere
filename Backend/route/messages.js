import { protectRoute } from "../auth/authCheck.js";
import { upload } from "../auth/multer.js";
import { createMessageController, getMessagesController } from "../controller/messages.js";
import express from 'express';

const messagesRouter = express.Router();

messagesRouter.get('/:id', protectRoute, getMessagesController);
messagesRouter.post('/create/:id', protectRoute, upload.single('file'),createMessageController);

export default messagesRouter;