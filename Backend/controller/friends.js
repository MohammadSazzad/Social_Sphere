import { getFriendsOfUser } from '../model/friends.js';
import { getUserById } from "../model/users.js";

export const getFriendsOfUserController = async (req, res) => {
    try {
        const userId = req.params.userId ;
        const result = await getFriendsOfUser(userId);
        res.status(200).json (result);
    }catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const getFriendByIdController = async (req, res) => {
    try {
        const id = req.params.friendId;
        const friend = await getUserById(id);
        res.status(200).json( friend );
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}