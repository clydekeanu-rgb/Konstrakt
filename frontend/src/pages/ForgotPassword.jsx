import { Link } from "react-router-dom";
import { useState } from "react";
import { Hammer, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const LOGIN_BG = "https://images.pexels.com/photos/13083354/pexels-photo-13083354.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordForEmail(email);
      toast.success("Password reset link sent.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.message ?? "Unable to send reset link.");
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
            data-testid="forgot-password-brand"
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
            <p className="cc-label !text-white/50">[ Password Recovery ]</p>
            <h1 className="font-display font-black tracking-tighter uppercase text-5xl sm:text-6xl lg:text-7xl mt-5 leading-[0.9]">
              Reset
              <br />
              <span className="text-[#FF5722]">password.</span>
            </h1>
            <p className="mt-6 text-white/70 max-w-md leading-relaxed">
              Recover your access to projects, price lists and BOQ rollups in just a few steps.
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
            data-testid="forgot-password-back-home"
            className="inline-flex items-center gap-2 cc-label hover:text-[#002FA7] mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>

          <p className="cc-label">[ Reset password ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase text-4xl sm:text-5xl mt-4 leading-[0.9]">
            Forgot your <span className="text-[#002FA7]">password?</span>
          </h2>

          {submitted ? (
            <div className="mt-10 p-6 border border-[#0A0A0A] bg-white space-y-5">
              <p className="font-mono text-sm leading-relaxed text-[#525252]">
                Check your email for a reset link.
              </p>
              <Link
                to="/login"
                data-testid="forgot-password-success-login"
                className="btn-primary w-full justify-center inline-flex"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-4 text-[#525252]">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  data-testid="forgot-password-link-login"
                  className="text-[#0A0A0A] underline underline-offset-4 hover:text-[#002FA7]"
                >
                  Sign in
                </Link>
              </p>

              <form
                onSubmit={submit}
                data-testid="forgot-password-form"
                className="mt-10 space-y-5"
              >
                <FormField label="Email" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    data-testid="forgot-password-input-email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@konstru.ph"
                    autoComplete="email"
                    className="w-full bg-white border border-[#0A0A0A] px-4 py-3.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-[#002FA7]"
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="forgot-password-submit"
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {loading ? "Sending reset link…" : "Send reset link"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}

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
