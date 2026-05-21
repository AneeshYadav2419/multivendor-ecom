import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-slate-100">
      <h1 className="text-3xl font-semibold tracking-tight">Multi Vendor Ecommerce</h1>
      <p className="max-w-md text-center text-slate-400">
        Browse products from multiple vendors in one marketplace.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium hover:border-slate-400"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
