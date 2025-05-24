import { create } from "zustand";
import toast from 'react-hot-toast';
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set, get) => ({
    messages: [],
    friends: [],
    selectedUser: null,
    isFriendsLoading: false,
    isMessagesLoading: false,

    getFriends: async (friendId) => {
        set({ isFriendsLoading: true });
        try {
            const res = await axiosInstance.get(`/friends/${friendId}`);
            set ({friends: res.data});
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isFriendsLoading: false });
        }
    },

    getMessage: async (friendId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${friendId}`);
            set({ messages: res.data , selectedUser: friendId });
        } catch (error) {
            toast.error(error.response.data.messages);
            set({ selectedUser: null });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (content, file, friendId) => {
        try {
        const formData = new FormData();
        formData.append("content", content);
        if (file) {
            formData.append("file", file);
        }
        const res = await axiosInstance.post(
            `/messages/create/${friendId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        set((state) => ({ messages: [...state.messages, res.data] }));
        return res.data;
        } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send message");
        throw err;
        }
    },
    subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            set({ 
                messages: [...get().messages, newMessage] 
            });
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({selectedUser}), 

}));