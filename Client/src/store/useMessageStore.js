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
            const messages = res.data?.data || res.data || [];
            set({ messages: Array.isArray(messages) ? messages : [], selectedUser: friendId });
        } catch (error) {
            console.error('Get messages error:', error);
            toast.error(error.response?.data?.message || 'Failed to load messages');
            set({ messages: [], selectedUser: null });
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
            
            const newMessage = res.data?.data || res.data;
            set((state) => ({ 
                messages: Array.isArray(state.messages) ? [...state.messages, newMessage] : [newMessage]
            }));
            return newMessage;
        } catch (err) {
            console.error('Send message error:', err);
            toast.error(err.response?.data?.message || "Failed to send message");
            throw err;
        }
    },
    subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const currentMessages = get().messages;
            
            const normalizedMessage = {
                id: newMessage.id,
                sender_id: newMessage.senderId || newMessage.sender_id,
                receiver_id: newMessage.receiverId || newMessage.receiver_id,
                content: newMessage.content,
                media_url: newMessage.media_url,
                is_read: newMessage.is_read,
                created_at: newMessage.created_at,
                sender_name: newMessage.sender_name
            };
            
            set({ 
                messages: Array.isArray(currentMessages) ? [...currentMessages, normalizedMessage] : [normalizedMessage]
            });
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({selectedUser}), 

}));