"use client";

import { RegisterForm } from "@/features/auth/components/register-form";

/**
 * Route page rendering the modular RegisterForm.
 * Kept strictly as a thin route orchestrator layout wrapper.
 */
export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 px-4 py-12">
      {/* Ambient Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-[150px] pointer-events-none" />

      <RegisterForm />
    </div>
  );
}