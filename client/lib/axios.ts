import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// Request interceptor (attach token later)
api.interceptors.request.use((config) => {
    return config;
});

// Response interceptor (global error handling)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API Error:", err.response?.data || err.message);
        return Promise.reject(err);
    }
);