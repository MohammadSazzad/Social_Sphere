import { createContext } from "react";


const Context = createContext(
    {
        users: [],
        events: [],
        posts: [],
        comments: [],
        messages: [],
        notifications: [],
        groups: [],
        friends: [],
        requests: [],
        user: {},
        event: {},
        post: {},
        comment: {},
        message: {},
        notification: {},
        group: {},
        friend: {},
        request: {},
        setUser: () => {},
        setEvent: () => {},
        setPost: () => {},
        setComment: () => {},
        setMessage: () => {},
        setNotification: () => {},
        setGroup: () => {},
        setFriend: () => {},
        setRequest: () => {},
        setUsers: () => {},
        setEvents: () => {},
        setPosts: () => {},
        setComments: () => {},
        setMessages: () => {},
        setNotifications: () => {},
        setGroups: () => {},
        setFriends: () => {},
        setRequests: () => {},
    }
);

export default Context;