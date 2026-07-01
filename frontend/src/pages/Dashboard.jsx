import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Plus, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/auth/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null); // projectId being confirmed

  // ---- fetch projects on mount ----
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("conscalc_projects")
          .select("id, name, instances, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        if (!cancelled) setProjects(data || []);
      } catch (e) {
        console.error("Failed to load projects:", e);
        toast.error("Failed to load projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

  // ---- create new project ----
  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("conscalc_projects")
        .insert({
          user_id: user.id,
          name: "",
          contingency: 0,
          instances: [],
        })
        .select("id")
        .single();

      if (error) throw error;
      navigate(`/project/${data.id}`);
    } catch (e) {
      console.error("Failed to create project:", e);
      toast.error("Failed to create project.");
      setCreating(false);
    }
  };

  // ---- delete project ----
  const handleDelete = async (projectId) => {
    try {
      const { error } = await supabase
        .from("conscalc_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted.");
    } catch (e) {
      console.error("Failed to delete project:", e);
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(null);
    }
  };

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
            <img
              src={process.env.PUBLIC_URL + "/logo.svg"}
              alt="Konstru"
              className="h-8 w-auto object-contain"
            />
            <span className="font-display font-black tracking-tighter text-xl uppercase">
              Konstru
            </span>
            <span className="hidden md:inline cc-label ml-3 border border-[#0A0A0A] px-2 py-0.5">
              Projects
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
              onClick={handleSignOut}
              data-testid="dashboard-signout"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] border border-[#0A0A0A] px-3 py-2 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722]"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
          <div>
            <p className="cc-label">[ Dashboard ]</p>
            <h1
              data-testid="dashboard-title"
              className="font-display font-black tracking-tighter uppercase mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[0.9]"
            >
              Your <span className="text-[#002FA7]">projects.</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            data-testid="new-project-button"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] bg-[#0A0A0A] text-white px-5 py-3 hover:bg-[#002FA7] transition-colors disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            )}
            New project
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-6 h-6 animate-spin text-[#002FA7]"
              data-testid="projects-loading"
            />
          </div>
        ) : projects.length === 0 ? (
          <div
            data-testid="projects-empty"
            className="border-2 border-dashed border-[#E5E5E5] py-20 flex flex-col items-center gap-4"
          >
            <FolderOpen className="w-10 h-10 text-[#C4C4C4]" />
            <p className="text-[#525252]">No projects yet.</p>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] bg-[#0A0A0A] text-white px-5 py-3 hover:bg-[#002FA7] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create your first project
            </button>
          </div>
        ) : (
          <div
            data-testid="project-list"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((p) => {
              const instanceCount = Array.isArray(p.instances)
                ? p.instances.length
                : 0;
              const isConfirming = deleting === p.id;

              return (
                <div
                  key={p.id}
                  data-testid="project-card"
                  className="group border border-[#E5E5E5] hover:border-[#0A0A0A] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/project/${p.id}`)}
                    className="w-full text-left px-5 py-5"
                  >
                    <h2 className="font-display font-black tracking-tight uppercase text-lg leading-tight truncate">
                      {p.name || "Untitled project"}
                    </h2>
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <span className="cc-label text-[#525252]">
                        {formatDistanceToNow(new Date(p.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                      {instanceCount > 0 && (
                        <span className="cc-label bg-[#F4F4F5] px-2 py-0.5">
                          {instanceCount}{" "}
                          {instanceCount === 1 ? "module" : "modules"}
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="border-t border-[#E5E5E5] px-5 py-2 flex justify-end">
                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <span className="cc-label text-[#FF5722]">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="font-mono text-[10px] uppercase tracking-[0.18em] text-white bg-[#FF5722] px-2.5 py-1 hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(null)}
                          className="font-mono text-[10px] uppercase tracking-[0.18em] border border-[#E5E5E5] px-2.5 py-1 hover:border-[#0A0A0A]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(p.id);
                        }}
                        data-testid="delete-project-button"
                        className="text-[#C4C4C4] hover:text-[#FF5722] transition-colors p-1"
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
