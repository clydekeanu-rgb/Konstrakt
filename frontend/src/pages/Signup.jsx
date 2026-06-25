import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Hammer, ArrowRight, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const LOGIN_BG = "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Fill out all fields to continue.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!agree) {
      toast.error("Please agree to the terms first.");
      return;
    }
    setLoading(true);
    try {
      const data = await signUp(email, password, { full_name: name });
      if (data?.session) {
        toast.success("Account created. You’re in.");
        navigate("/dashboard", { replace: true });
      } else {
        toast.success("Account created. Check your email to confirm.", {
          description: "We sent a confirmation link to " + email + ".",
        });
        navigate("/login", { replace: true });
      }
    } catch (err) {
      toast.error(err?.message ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      await signInWithGoogle("/dashboard");
    } catch (err) {
      toast.error(err?.message ?? "Unable to start Google sign-up.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      <aside className="relative hidden lg:block border-r border-[#0A0A0A] overflow-hidden bg-[#0A0A0A] text-white">
        <img
          src={LOGIN_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/85 via-[#0A0A0A]/40 to-[#0A0A0A]/90" />
        <div className="absolute inset-0 blueprint-grid-dark pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-12">
          <Link
            to="/"
            data-testid="signup-brand"
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
            <p className="cc-label !text-white/50">[ New account ]</p>
            <h1 className="font-display font-black tracking-tighter uppercase text-5xl sm:text-6xl lg:text-7xl mt-5 leading-[0.9]">
              Build with
              <br />
              <span className="text-[#FF5722]">precision.</span>
            </h1>
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">
              Start with a ₱299 week, scale to a ₱4,999 year — all plans
              unlock every module and every future update.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "14 calculation modules in one engine",
                "BOQ priced natively in Philippine Pesos",
                "Multiple instances per element type",
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <span className="w-5 h-5 grid place-items-center border border-[#FF5722]">
                    <Check className="w-3 h-3 text-[#FF5722]" strokeWidth={3} />
                  </span>
                  <span className="font-mono text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            ConsCalc · Made in the Philippines
          </div>
        </div>
      </aside>

      <section className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 blueprint-grid opacity-50 pointer-events-none" />
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            data-testid="signup-back-home"
            className="inline-flex items-center gap-2 cc-label hover:text-[#002FA7] mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>

          <p className="cc-label">[ Create account ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase text-4xl sm:text-5xl mt-4 leading-[0.9]">
            Create your <span className="text-[#002FA7]">ConsCalc</span> account.
          </h2>
          <p className="mt-4 text-[#525252]">
            Already a user?{" "}
            <Link
              to="/login"
              data-testid="signup-link-login"
              className="text-[#0A0A0A] underline underline-offset-4 hover:text-[#002FA7]"
            >
              Sign in →
            </Link>
          </p>

          <form
            onSubmit={submit}
            data-testid="signup-form"
            className="mt-10 space-y-5"
          >
            <Field label="Full name" id="name">
              <input
                id="name"
                type="text"
                value={name}
                data-testid="signup-input-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
              />
            </Field>

            <Field label="Work email" id="signup-email">
              <input
                id="signup-email"
                type="email"
                value={email}
                data-testid="signup-input-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@conscalc.ph"
                autoComplete="email"
                className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
              />
            </Field>

            <Field label="Password" id="signup-password">
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  data-testid="signup-input-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                />
                <button
                  type="button"
                  data-testid="signup-toggle-password"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center text-[#525252] hover:text-[#0A0A0A]"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <label
              className="flex items-start gap-3 cursor-pointer select-none"
              data-testid="signup-agree-wrapper"
            >
              <input
                type="checkbox"
                checked={agree}
                data-testid="signup-agree"
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4 border border-[#0A0A0A] accent-[#002FA7]"
              />
              <span className="text-sm text-[#525252] leading-relaxed">
                I agree to the{" "}
                <a href="#" className="underline underline-offset-4 text-[#0A0A0A]">
                  terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-4 text-[#0A0A0A]">
                  privacy policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              data-testid="signup-submit"
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="relative my-2 flex items-center">
              <div className="flex-1 h-px bg-[#E5E5E5]" />
              <span className="px-3 cc-label">or</span>
              <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>

            <button
              type="button"
              data-testid="signup-google"
              onClick={onGoogle}
              className="btn-secondary w-full justify-center"
            >
              <GoogleMark /> Continue with Google
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="cc-label block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path d="M23 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.16c-.27 1.4-1.07 2.59-2.28 3.39v2.82h3.68C21.7 18.74 23 15.77 23 12.27Z" fill="#4285F4" />
      <path d="M12 23c3.06 0 5.63-1.02 7.5-2.77l-3.68-2.82c-1.02.68-2.32 1.09-3.82 1.09-2.94 0-5.43-1.98-6.32-4.64H1.86v2.91A11 11 0 0 0 12 23Z" fill="#34A853" />
      <path d="M5.68 13.86A6.6 6.6 0 0 1 5.36 12c0-.65.11-1.27.32-1.86V7.23H1.86A11 11 0 0 0 1 12c0 1.77.42 3.45 1.16 4.93l3.52-3.07Z" fill="#FBBC05" />
      <path d="M12 5.5c1.66 0 3.15.57 4.32 1.69l3.24-3.24C17.62 2.16 15.06 1 12 1A11 11 0 0 0 1.86 7.23l3.82 2.91C6.57 7.48 9.06 5.5 12 5.5Z" fill="#EA4335" />
    </svg>
  );
}
