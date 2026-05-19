import { api } from "@/lib/api/axios";

type LoginData = {
    email: string;
    password: string;
};

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

export const loginUser = async (
    data: LoginData
) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const registerUser = async (
    data: RegisterData
) => {
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await api.post(
        "/auth/refresh"
    );

    return response.data;
};

export const getMe = async () => {
    const response = await api.get(
        "/auth/me"
    );

    return response.data;
};