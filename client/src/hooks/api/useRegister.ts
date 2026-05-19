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

    return useMutation({
        mutationFn: registerUser,

        onSuccess: (response) => {
            const user = response?.data?.user;
            
            if (user?.role === "VENDOR") {
                toast.success(
                    "Vendor account registered successfully! Awaiting admin approval."
                );
            } else {
                toast.success(
                    "Account created successfully! Please log in."
                );
            }

            // Redirect all new signups to the login page so they can authenticate securely
            router.push("/login");
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "Registration failed"
            );
        },
    });
};