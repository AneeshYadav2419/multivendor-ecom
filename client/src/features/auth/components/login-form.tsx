"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";

import { useLoginMutation } from "../hooks/use-auth-mutations";
import { loginSchema, LoginFormValues } from "../validations/auth-schemas";
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

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (user) => {
      if (redirectTo && user.role === "CUSTOMER") {
        router.push(redirectTo);
        return;
      }
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "VENDOR") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/products");
      }
    },
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md z-10"
    >
      {/* Branding/Header */}
      <div className="flex flex-col items-center mb-8 text-center space-y-2">
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
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your secure panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-300 font-medium">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
                      >
                        Forgot?
                      </Link>
                    </div>
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-slate-800/60 pt-6 pb-6 text-center text-sm text-slate-400">
          <div>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
export default LoginForm;
