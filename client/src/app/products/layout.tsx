import { GlassNavbar } from "@/components/layout/glass-navbar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[480px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/2 right-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>
      <GlassNavbar />
      <div className="relative">{children}</div>
    </div>
  );
}
