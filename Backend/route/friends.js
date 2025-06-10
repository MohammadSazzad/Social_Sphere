import { getFriendsOfUserController, getFriendByIdController } from '../controller/friends.js';
import express from 'express';

const friendRouter = express.Router();

friendRouter.get('/:userId', getFriendsOfUserController);
friendRouter.get('/friendId/:friendId', getFriendByIdController);

export default friendRouter ;