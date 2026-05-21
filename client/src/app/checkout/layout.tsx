import { GlassNavbar } from "@/components/layout/glass-navbar";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <GlassNavbar />
      <div className="relative">{children}</div>
    </div>
  );
}
