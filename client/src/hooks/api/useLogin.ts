// import { useMutation } from "@tanstack/react-query";

// import { loginUser } from "@/lib/api/auth";

// import { useAuthStore } from "@/store/useAuthStore";

// export const useLogin = () => {
//     const login = useAuthStore(
//         (state) => state.login
//     );

//     return useMutation({
//         mutationFn: loginUser,

//         onSuccess: (data) => {
//             login(
//                 data.user,
//                 data.accessToken
//             );
//         },

//         onError: (error) => {
//             console.error("Login Failed:", error);
//         },
//     });
// };
"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { loginUser } from "@/lib/api/auth";

import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
    const router = useRouter();

    const login = useAuthStore(
        (state) => state.login
    );

    return useMutation({
        mutationFn: loginUser,

        onSuccess: (data) => {
            login(
                data.user,
                data.accessToken
            );

            toast.success(
                "Login successful"
            );

            // ROLE-BASED REDIRECT
            if (
                data.user.role === "ADMIN"
            ) {
                router.push("/admin");
            } else if (
                data.user.role === "VENDOR"
            ) {
                router.push(
                    "/vendor/dashboard"
                );
            } else {
                router.push("/");
            }
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "Login failed"
            );
        },
    });
};