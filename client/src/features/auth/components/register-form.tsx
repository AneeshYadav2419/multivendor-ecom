"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Store, Eye, EyeOff, ArrowRight, Loader2, Sparkles, ShoppingBag } from "lucide-react";

import { useRegisterMutation } from "../hooks/use-auth-mutations";
import { registerSchema, RegisterFormValues } from "../validations/auth-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize registration mutation with post-sign-up redirects
  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: () => {
      // Redirect all new users to log in securely
      router.push("/login");
    },
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      storeName: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = (values: RegisterFormValues) => {
    const payload = {
      ...values,
      storeName: values.role === "VENDOR" ? values.storeName : undefined,
    };
    register(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg z-10"
    >
      {/* Branding/Header */}
      <div className="flex flex-col items-center mb-6 text-center space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          AuraMarket
        </h2>
        <p className="text-sm text-indigo-200/60 font-medium">
          The elite multivendor commerce ecosystem
        </p>
      </div>

      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/40">
        <CardHeader className="space-y-1.5 pb-6">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Join us as a customer or setup your vendor store today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection Grid */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-300 font-medium">
                      I want to register as a:
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange("CUSTOMER")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 text-center gap-2 group/role focus:outline-none ${
                          field.value === "CUSTOMER"
                            ? "bg-indigo-650/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] text-white"
                            : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg transition-colors ${
                            field.value === "CUSTOMER"
                              ? "bg-indigo-500 text-white"
                              : "bg-slate-900 text-slate-500 group-hover/role:bg-slate-850 group-hover/role:text-slate-300"
                          }`}
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-sm">Customer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange("VENDOR")}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 text-center gap-2 group/role focus:outline-none ${
                          field.value === "VENDOR"
                            ? "bg-fuchsia-650/20 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.15)] text-white"
                            : "bg-slate-950/30 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-lg transition-colors ${
                            field.value === "VENDOR"
                              ? "bg-fuchsia-500 text-white"
                              : "bg-slate-900 text-slate-500 group-hover/role:bg-slate-850 group-hover/role:text-slate-300"
                          }`}
                        >
                          <Store className="h-5 w-5" />
                        </div>
                        <span className="font-semibold text-sm">Vendor</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">
                      Full Name
                    </FormLabel>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950/80 transition-all rounded-lg"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">
                      Email Address
                    </FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950/80 transition-all rounded-lg"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />

              {/* Conditional Store Name Expand Form */}
              <AnimatePresence initial={false}>
                {selectedRole === "VENDOR" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem className="py-1">
                          <FormLabel className="text-slate-300 font-medium">
                            Store Name
                          </FormLabel>
                          <div className="relative">
                            <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
                            <FormControl>
                              <Input
                                placeholder="e.g. Apex Tech Store"
                                className="pl-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 focus:bg-slate-950/80 transition-all rounded-lg"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-rose-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-950/80 transition-all rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-rose-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold transition-all duration-300 shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] rounded-lg mt-6 flex items-center justify-center gap-2 group"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-slate-800/60 pt-6 pb-6 text-center text-sm text-slate-400">
          <div>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 transition-colors"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default RegisterForm;
