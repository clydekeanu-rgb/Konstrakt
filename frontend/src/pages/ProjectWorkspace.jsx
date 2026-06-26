import { useParams, useNavigate, Link } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import Calculator from "@/calculator/Calculator";

export default function ProjectWorkspace() {
  const { projectId } = useParams();
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
          <div className="flex items-center gap-4">
            <Link
              to="/"
              data-testid="dashboard-logo"
              className="flex items-center gap-2"
            >
              <img
                src={process.env.PUBLIC_URL + "/logo.svg"}
                alt="Konstru"
                className="h-8 w-auto object-contain"
              />
              <span className="font-display font-black tracking-tighter text-xl uppercase">
                Konstru
              </span>
            </Link>
            <Link
              to="/dashboard"
              data-testid="back-to-projects"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#525252] hover:text-[#002FA7] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All projects
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span
              data-testid="dashboard-user-email"
              className="hidden sm:inline cc-label"
            >
              {user?.email}
            </span>
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
      <Calculator projectId={projectId} />
    </div>
  );
}
