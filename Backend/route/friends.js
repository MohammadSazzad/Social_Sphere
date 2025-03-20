import { getFriendsOfUserController } from '../controller/friends.js';
import express from 'express';

const friendRouter = express.Router();

friendRouter.get('/:userId', getFriendsOfUserController);

export default friendRouter ;