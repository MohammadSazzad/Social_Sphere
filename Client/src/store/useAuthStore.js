import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignedIn: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    isCheckingAuth: true,
    checkAuth : async () => {
        try {
            const response = await axiosInstance.get('/users/check');
            set({ authUser: response.data, isSignedIn: true });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
            console.log(error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/users/logout', {}, {
                withCredentials: true
            });
            get().disconnectSocket();
        } finally {
            set({ authUser: null, isSignedIn: false, });
        }
    },

    login : async ( data ) => {
        set({ isLoggingIn: true });
        
        try {
            const response = await axiosInstance.post('/users/login', data);
            if (response.status === 200) {
                alert("Login Successful");
                set({ authUser: response.data, isSignedIn: true });
            }
            get().connectSocket();
        } catch (error) {
            console.log(error);
        } finally{
            set({ isLoggingIn: false });
        }
    },
      
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
        
        const socket = io(SOCKET_URL, {
            auth: { userId: authUser.id },
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
    
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds)=> {
            set({ onlineUsers: userIds })
        })
    },
    
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?. connected) {
        socket.disconnect();
        set({ socket: null });
        }
    }
}));