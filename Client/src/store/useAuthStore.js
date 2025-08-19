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
        } catch (error) {
            console.log("Backend logout error:", error);
            get().disconnectSocket();
        } finally {
            set({ authUser: null, isSignedIn: false });
        }
    },

    login : async ( data ) => {
        set({ isLoggingIn: true });
        
        try {
            const response = await axiosInstance.post('/users/login', data);
            if (response.status === 200) {
                set({ authUser: response.data, isSignedIn: true });
                get().connectSocket();
                return { success: true, user: response.data };
            }
        } catch (error) {
            console.log("Login error:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            set({ authUser: null, isSignedIn: false });
            throw new Error(errorMessage);
        } finally{
            set({ isLoggingIn: false });
        }
    },
      
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const SOCKET_URL = 'https://socialsphere.eastasia.cloudapp.azure.com';
        
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
    verify : async (otpValue) => {
        const response = await axiosInstance.post('/users/verify', { otp: otpValue });
        set({ authUser: response.data, isSignedIn: true });
        get().connectSocket();
        return response.data;
    },
    
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?. connected) {
        socket.disconnect();
        set({ socket: null });
        }
    }
}));