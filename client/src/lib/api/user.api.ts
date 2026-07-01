import { api } from "@/lib/api/axios";

export interface ProfileUpdatePayload {
    name?: string;
    email?: string;
}

export interface PasswordChangePayload {
    currentPassword: string;
    newPassword: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    createdAt: string;
    isActive: boolean;
}

interface ProfileResponse {
    success: boolean;
    data: { user: UserProfile };
}

export const getProfile = async (): Promise<UserProfile> => {
    const response = await api.get<ProfileResponse>("/user/profile");
    return response.data.data.user;
};

export const updateProfile = async (
    payload: ProfileUpdatePayload
): Promise<UserProfile> => {
    const response = await api.put<ProfileResponse>("/user/profile", payload);
    return response.data.data.user;
};

export const changePassword = async (
    payload: PasswordChangePayload
): Promise<void> => {
    await api.put("/user/password", payload);
};