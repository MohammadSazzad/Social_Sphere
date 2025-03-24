import { getFriendsOfUser } from '../model/friends.js';

export const getFriendsOfUserController = async (req, res) => {
    try {
        const userId = req.params.userId ;
        console.log(userId);
        const result = await getFriendsOfUser(userId);
        res.status(200).json (result);
    }catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
    }
}