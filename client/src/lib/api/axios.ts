import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    async (config) => {
        const token =
            useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        console.error(
            "API Error:",
            error.response?.data || error.message
        );

        return Promise.reject(error);
    }
);