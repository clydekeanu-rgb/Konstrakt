import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Hammer } from "lucide-react";

const links = [
  { href: "#features", label: "Modules" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5] transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_#0a0a0a]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-testid="navbar-logo"
          className="flex items-center gap-2 group"
        >
          <span className="w-8 h-8 bg-[#0A0A0A] text-white grid place-items-center">
            <Hammer className="w-4 h-4" strokeWidth={2.5} />
          </span>
          <span className="font-display font-black tracking-tighter text-xl uppercase">
            Cons<span className="text-[#002FA7]">Calc</span>
          </span>
          <span className="hidden md:inline cc-label ml-2 border border-[#E5E5E5] px-2 py-0.5">
            v0.1 · PH
          </span>
        </Link>

        {onLanding && (
          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="nav-link"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            data-testid="navbar-signin"
            className="nav-link px-2"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            data-testid="navbar-signup"
            className="btn-primary text-xs px-5 py-2.5"
          >
            Get started
          </Link>
        </div>

        <button
          data-testid="navbar-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-10 h-10 grid place-items-center border border-[#0A0A0A]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          data-testid="mobile-menu"
          className="lg:hidden border-t border-[#E5E5E5] bg-white"
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            {onLanding &&
              links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="nav-link"
                >
                  {l.label}
                </a>
              ))}
            <div className="flex gap-3 pt-4 border-t border-[#E5E5E5]">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn-secondary flex-1"
                data-testid="mobile-signin"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="btn-primary flex-1"
                data-testid="mobile-signup"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
