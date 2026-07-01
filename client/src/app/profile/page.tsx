"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
    User, Mail, Lock, Eye, EyeOff,
    Loader2, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import {
    getProfile,
    updateProfile,
    changePassword,
    UserProfile,
} from "@/lib/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

/* ── Zod schemas (mirror backend validation) ── */

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email"),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "Must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

/* ── Page ── */

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch {
                toast.error("Couldn't load profile. Please refresh.");
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoadingProfile) {
        return (
            <PageShell>
                <div className="mx-auto max-w-2xl space-y-5 px-4 py-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-800/50" />
                    ))}
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">

                {/* Header */}
                <div className="mb-10">
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                        <Sparkles className="h-3 w-3" />
                        Account settings
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        My profile
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Manage your personal information and security settings.
                    </p>
                </div>

                {/* Role badge */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                        {profile?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{profile?.name}</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300">
                            <ShieldCheck className="h-3 w-3" />
                            {profile?.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-5">
                    <ProfileForm
                        profile={profile}
                        onSuccess={(updated) => {
                            setProfile(updated);
                            if (user) setUser({ ...user, name: updated.name, email: updated.email });
                        }}
                    />
                    <PasswordForm />
                </div>
            </div>
        </PageShell>
    );
};

/* ── Profile Info Form ── */

interface ProfileFormProps {
    profile: UserProfile | null;
    onSuccess: (updated: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSuccess }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.name ?? "",
            email: profile?.email ?? "",
        },
    });

    // Sync form when profile loads
    useEffect(() => {
        if (profile) {
            form.reset({ name: profile.name, email: profile.email });
        }
    }, [profile, form]);

    const onSubmit = async (values: ProfileValues) => {
        setIsSaving(true);
        setSaved(false);
        try {
            const updated = await updateProfile(values);
            onSuccess(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            toast.success("Profile updated successfully");
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Update failed. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SectionCard title="Personal information" icon={<User className="h-4 w-4" />}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 font-medium">Full name</FormLabel>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="John Doe"
                                            className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className="text-rose-400" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 font-medium">Email address</FormLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className="text-rose-400" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-300" />
                                Saved!
                            </>
                        ) : (
                            "Save changes"
                        )}
                    </Button>
                </form>
            </Form>
        </SectionCard>
    );
};

/* ── Password Form ── */

const PasswordForm: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    const onSubmit = async (values: PasswordValues) => {
        setIsSaving(true);
        try {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success("Password changed successfully");
            form.reset();
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? "Couldn't change password. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SectionCard title="Change password" icon={<Lock className="h-4 w-4" />}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PasswordField
                        control={form.control}
                        name="currentPassword"
                        label="Current password"
                        show={showCurrent}
                        onToggle={() => setShowCurrent((v) => !v)}
                    />
                    <PasswordField
                        control={form.control}
                        name="newPassword"
                        label="New password"
                        show={showNew}
                        onToggle={() => setShowNew((v) => !v)}
                    />
                    <PasswordField
                        control={form.control}
                        name="confirmPassword"
                        label="Confirm new password"
                        show={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                    />

                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Changing...
                            </>
                        ) : (
                            "Change password"
                        )}
                    </Button>
                </form>
            </Form>
        </SectionCard>
    );
};

/* ── Reusable password field ── */

const PasswordField: React.FC<{
    control: any;
    name: "currentPassword" | "newPassword" | "confirmPassword";
    label: string;
    show: boolean;
    onToggle: () => void;
}> = ({ control, name, label, show, onToggle }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="text-slate-300 font-medium">{label}</FormLabel>
                <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <FormControl>
                        <Input
                            {...field}
                            type={show ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                        />
                    </FormControl>
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <FormMessage className="text-rose-400" />
            </FormItem>
        )}
    />
);

/* ── Section card wrapper ── */

const SectionCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, icon, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6"
    >
        <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                {icon}
            </div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
        </div>
        {children}
    </motion.div>
);

/* ── Page shell ── */

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative min-h-screen bg-slate-950">
        <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
                backgroundImage:
                    "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.25), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(217,70,239,0.15), transparent)",
            }}
        />
        <div className="relative">{children}</div>
    </div>
);

export default ProfilePage;