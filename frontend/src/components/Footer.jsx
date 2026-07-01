import { Link } from "react-router-dom";
import { Hammer, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="bg-[#0A0A0A] text-white blueprint-grid-dark"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-24 pb-10">
        <div className="border-b border-white/10 pb-16">
          <p className="cc-label !text-white/50">[ Footer · 06 ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase text-[clamp(3.5rem,11vw,11rem)] leading-[0.85] mt-4">
            Let’s
            <br />
            <span className="text-[#FF5722]">build.</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/signup"
              data-testid="footer-signup"
              className="btn-primary"
            >
              Create free account
            </Link>
            <a
              href="mailto:hello@konstru.ph"
              data-testid="footer-contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/30 text-white font-mono uppercase tracking-[0.18em] text-xs hover:bg-white hover:text-[#0A0A0A] transition-colors"
            >
              <Mail className="w-4 h-4" /> hello@konstru.ph
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-14">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2">
              <img
                src={process.env.PUBLIC_URL + "/logo.svg"}
                alt="Konstru"
                className="h-8 w-auto object-contain"
              />
              <span className="font-display font-black tracking-tighter text-xl uppercase text-white">
                Konstru
              </span>
            </div>
            <p className="mt-5 max-w-sm text-white/60 leading-relaxed">
              A quantity takeoff and cost estimator built for Filipino
              construction. Dimensions in, BOM and BOQ out — in PHP.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="cc-label !text-white/50">Product</p>
            <ul className="mt-4 space-y-3 font-mono text-sm">
              <li><a href="#features" className="hover:text-[#FF5722]">Modules</a></li>
              <li><a href="#how" className="hover:text-[#FF5722]">How it works</a></li>
              <li><a href="#pricing" className="hover:text-[#FF5722]">Pricing</a></li>
              <li><a href="#faq" className="hover:text-[#FF5722]">FAQ</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="cc-label !text-white/50">Account</p>
            <ul className="mt-4 space-y-3 font-mono text-sm">
              <li><Link to="/login" className="hover:text-[#FF5722]">Sign in</Link></li>
              <li><Link to="/signup" className="hover:text-[#FF5722]">Sign up</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="cc-label !text-white/50">Made in</p>
            <p className="mt-4 font-mono text-sm leading-relaxed">
              Metro Manila, Philippines.
              <br />
              For contractors, engineers, and homeowners.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 grid place-items-center border border-white/20 hover:bg-[#FF5722] hover:border-[#FF5722]"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 grid place-items-center border border-white/20 hover:bg-[#FF5722] hover:border-[#FF5722]"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <p className="font-mono text-xs text-white/50 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Konstru. All rights reserved.
          </p>
          <p className="font-mono text-xs text-white/50 uppercase tracking-[0.2em]">
            Currency: PHP · Bars: 6.0 m · Cement: 40 kg
          </p>
        </div>
      </div>
    </footer>
  );
}
