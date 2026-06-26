import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Hammer, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const LOGIN_BG = "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Fill out all fields to continue.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      toast.success("Password updated.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.message ?? "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: image / brand */}
      <aside className="relative hidden lg:block border-r border-[#0A0A0A] overflow-hidden bg-[#0A0A0A] text-white">
        <img
          src={LOGIN_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/80 via-[#0A0A0A]/40 to-[#0A0A0A]/90" />
        <div className="absolute inset-0 blueprint-grid-dark pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-12">
          <Link
            to="/"
            data-testid="update-password-brand"
            className="inline-flex items-center gap-2 w-fit"
          >
            <img
              src={process.env.PUBLIC_URL + "/logo.svg"}
              alt="Konstru"
              className="h-9 w-auto object-contain"
            />
            <span className="font-display font-black tracking-tighter text-2xl uppercase">
              Konstru
            </span>
          </Link>

          <div>
            <p className="cc-label !text-white/50">[ Password Reset ]</p>
            <h1 className="font-display font-black tracking-tighter uppercase text-5xl sm:text-6xl lg:text-7xl mt-5 leading-[0.9]">
              New
              <br />
              <span className="text-[#FF5722]">security.</span>
            </h1>
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">
              Update your account credentials to keep your project calculations secure.
            </p>
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Konstru · Metro Manila · PHP
          </div>
        </div>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 blueprint-grid opacity-50 pointer-events-none" />
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            data-testid="update-password-back-home"
            className="inline-flex items-center gap-2 cc-label hover:text-[#002FA7] mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>

          <p className="cc-label">[ Reset password ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase text-4xl sm:text-5xl mt-4 leading-[0.9]">
            Create a <span className="text-[#002FA7]">new password.</span>
          </h2>
          <p className="mt-4 text-[#525252]">
            Ensure your new password is at least 6 characters.
          </p>

          <form
            onSubmit={submit}
            data-testid="update-password-form"
            className="mt-10 space-y-5"
          >
            <FormField label="New password" htmlFor="newPassword">
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  data-testid="update-password-input-new"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-[#002FA7]"
                />
                <button
                  type="button"
                  data-testid="update-password-toggle-new"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-[#525252] hover:text-[#0A0A0A]"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm password" htmlFor="confirmPassword">
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  data-testid="update-password-input-confirm"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-[#002FA7]"
                />
                <button
                  type="button"
                  data-testid="update-password-toggle-confirm"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-[#525252] hover:text-[#0A0A0A]"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={loading}
              data-testid="update-password-submit"
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Updating password…" : "Update password"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-10 cc-label text-center">
            By continuing you agree to Konstru’s terms of use.
          </p>
        </div>
      </section>
    </main>
  );
}

function FormField({ label, htmlFor, hint, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={htmlFor} className="cc-label">
          {label}
        </label>
        {hint}
      </div>
      {children}
    </div>
  );
}
