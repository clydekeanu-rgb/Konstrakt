import { useNavigate, Link } from "react-router-dom";
import { Hammer, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import Calculator from "@/calculator/Calculator";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out.");
      navigate("/login", { replace: true });
    } catch (e) {
      toast.error(e.message ?? "Unable to sign out.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <header
        data-testid="dashboard-topbar"
        className="sticky top-0 z-40 bg-white border-b border-[#0A0A0A]"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            data-testid="dashboard-logo"
            className="flex items-center gap-2"
          >
            <span className="w-8 h-8 bg-[#0A0A0A] text-white grid place-items-center">
              <Hammer className="w-4 h-4" strokeWidth={2.5} />
            </span>
            <span className="font-display font-black tracking-tighter text-xl uppercase">
              Cons<span className="text-[#002FA7]">Calc</span>
            </span>
            <span className="hidden md:inline cc-label ml-3 border border-[#0A0A0A] px-2 py-0.5">
              Workspace
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span
              data-testid="dashboard-user-email"
              className="hidden sm:inline cc-label"
            >
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              data-testid="dashboard-print"
              className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] border border-[#0A0A0A] px-3 py-2 hover:bg-[#002FA7] hover:text-white hover:border-[#002FA7]"
            >
              Print / PDF
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              data-testid="dashboard-signout"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] border border-[#0A0A0A] px-3 py-2 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722]"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <Calculator />
    </div>
  );
}
