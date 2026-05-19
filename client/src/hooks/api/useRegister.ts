// import { useMutation } from "@tanstack/react-query";

// import { registerUser } from "@/lib/api/auth";

// import { useAuthStore } from "@/store/useAuthStore";

// export const useRegister = () => {
//     const login = useAuthStore(
//         (state) => state.login
//     );

//     return useMutation({
//         mutationFn: registerUser,

//         onSuccess: (data) => {
//             login(
//                 data.user,
//                 data.accessToken
//             );
//         },

//         onError: (error) => {
//             console.error(
//                 "Registration Failed:",
//                 error
//             );
//         },
//     });
// };

"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { registerUser } from "@/lib/api/auth";

import { useAuthStore } from "@/store/useAuthStore";

export const useRegister = () => {
    const router = useRouter();

    const login = useAuthStore(
        (state) => state.login
    );

    return useMutation({
        mutationFn: registerUser,

        onSuccess: (data) => {
            login(
                data.user,
                data.accessToken
            );

            toast.success(
                "Account created successfully"
            );

            // ROLE-BASED REDIRECT
            if (
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
                "Registration failed"
            );
        },
    });
};