import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSignedIn: false,
    isLoggingIn: false,

    isCheckingAuth: true,
    checkAuth : async () => {
        try {
            const response = await axiosInstance.get('/users/check');
            set({ authUser: response.data, isSignedIn: true });
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
        } catch (error) {
            console.log(error);
        } finally{
            set({ isLoggingIn: false });
        }
    }
}));