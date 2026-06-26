import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Hammer, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const LOGIN_BG = "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Signed in.");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message ?? "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      await signInWithGoogle(from);
    } catch (err) {
      toast.error(err?.message ?? "Unable to start Google sign-in.");
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
            data-testid="login-brand"
            className="inline-flex items-center gap-2 w-fit"
          >
            <span className="w-9 h-9 bg-white text-[#0A0A0A] grid place-items-center">
              <Hammer className="w-4 h-4" strokeWidth={2.5} />
            </span>
            <span className="font-display font-black tracking-tighter text-2xl uppercase">
              ConsCalc
            </span>
          </Link>

          <div>
            <p className="cc-label !text-white/50">[ Returning user ]</p>
            <h1 className="font-display font-black tracking-tighter uppercase text-5xl sm:text-6xl lg:text-7xl mt-5 leading-[0.9]">
              Welcome
              <br />
              <span className="text-[#FF5722]">back.</span>
            </h1>
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">
              Pick up your projects, price lists and BOQ rollups exactly where
              you left them.
            </p>
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            ConsCalc · Metro Manila · PHP
          </div>
        </div>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 blueprint-grid opacity-50 pointer-events-none" />
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            data-testid="login-back-home"
            className="inline-flex items-center gap-2 cc-label hover:text-[#002FA7] mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>

          <p className="cc-label">[ Sign in ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase text-4xl sm:text-5xl mt-4 leading-[0.9]">
            Sign in to <span className="text-[#002FA7]">ConsCalc</span>.
          </h2>
          <p className="mt-4 text-[#525252]">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              data-testid="login-link-signup"
              className="text-[#0A0A0A] underline underline-offset-4 hover:text-[#002FA7]"
            >
              Create one →
            </Link>
          </p>

          <form
            onSubmit={submit}
            data-testid="login-form"
            className="mt-10 space-y-5"
          >
            <FormField label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                data-testid="login-input-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@conscalc.ph"
                autoComplete="email"
                className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-[#002FA7]"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              hint={
                <Link
                  to="/forgot-password"
                  data-testid="login-forgot"
                  className="cc-label hover:text-[#002FA7]"
                >
                  Forgot?
                </Link>
              }
            >
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  data-testid="login-input-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-[#002FA7]"
                />
                <button
                  type="button"
                  data-testid="login-toggle-password"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-[#525252] hover:text-[#0A0A0A]"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit"
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <Divider />

            <button
              type="button"
              data-testid="login-google"
              onClick={onGoogle}
              className="btn-secondary w-full justify-center"
            >
              <GoogleMark /> Continue with Google
            </button>
          </form>

          <p className="mt-10 cc-label text-center">
            By signing in you agree to ConsCalc’s terms of use.
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

function Divider() {
  return (
    <div className="relative my-2 flex items-center">
      <div className="flex-1 h-px bg-[#E5E5E5]" />
      <span className="px-3 cc-label">or</span>
      <div className="flex-1 h-px bg-[#E5E5E5]" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.16c-.27 1.4-1.07 2.59-2.28 3.39v2.82h3.68C21.7 18.74 23 15.77 23 12.27Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c3.06 0 5.63-1.02 7.5-2.77l-3.68-2.82c-1.02.68-2.32 1.09-3.82 1.09-2.94 0-5.43-1.98-6.32-4.64H1.86v2.91A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.68 13.86A6.6 6.6 0 0 1 5.36 12c0-.65.11-1.27.32-1.86V7.23H1.86A11 11 0 0 0 1 12c0 1.77.42 3.45 1.16 4.93l3.52-3.07Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.5c1.66 0 3.15.57 4.32 1.69l3.24-3.24C17.62 2.16 15.06 1 12 1A11 11 0 0 0 1.86 7.23l3.82 2.91C6.57 7.48 9.06 5.5 12 5.5Z"
        fill="#EA4335"
      />
    </svg>
  );
}
