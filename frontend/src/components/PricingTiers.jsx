import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import { PRICING_TIERS } from "@/lib/modules";

/**
 * Shared pricing card grid, used by both Landing.jsx (embedded section)
 * and pages/Pricing.jsx (standalone page).
 *
 * Auth-aware CTA:
 *  - Logged-out  → Link to /signup
 *  - Logged-in   → toast placeholder (TODO: wire real checkout)
 */
export default function PricingTiers() {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#E5E5E5]">
      {PRICING_TIERS.map((t) => (
        <article
          key={t.id}
          data-testid={`pricing-card-${t.id}`}
          className={`relative border-r border-b border-[#E5E5E5] p-8 lg:p-10 flex flex-col ${
            t.highlight ? "bg-[#0A0A0A] text-white" : "bg-white"
          }`}
        >
          {t.highlight && (
            <span className="absolute -top-3 left-8 font-mono text-[10px] uppercase tracking-[0.22em] bg-[#FF5722] text-white px-3 py-1.5">
              Best value
            </span>
          )}
          <div className="flex items-baseline justify-between">
            <h3
              className={`font-display font-black tracking-tighter uppercase text-3xl ${
                t.highlight ? "text-white" : "text-[#0A0A0A]"
              }`}
            >
              {t.name}
            </h3>
            <span className={`cc-label ${t.highlight ? "!text-white/50" : ""}`}>
              Tier
            </span>
          </div>
          <p className={`text-sm mt-3 ${t.highlight ? "text-white/70" : "text-[#525252]"}`}>
            {t.tagline}
          </p>
          <div className="mt-8 flex items-baseline gap-1">
            <span className="font-display font-black tracking-tighter text-6xl">
              {t.price}
            </span>
            <span
              className={`font-mono text-sm ${
                t.highlight ? "text-white/60" : "text-[#525252]"
              }`}
            >
              {t.cadence}
            </span>
          </div>

          <ul className="mt-8 space-y-3 flex-1">
            {t.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    t.highlight ? "text-[#FF5722]" : "text-[#002FA7]"
                  }`}
                  strokeWidth={3}
                />
                <span
                  className={`text-sm ${t.highlight ? "text-white/90" : "text-[#0A0A0A]"}`}
                >
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {user ? (
            // TODO: wire up real checkout/payment flow once payment processor is integrated
            <button
              type="button"
              data-testid={`pricing-cta-${t.id}`}
              onClick={() =>
                toast.info(`Checkout coming soon — plan: ${t.name}`)
              }
              className={
                t.highlight
                  ? "mt-10 inline-flex items-center justify-center gap-2 bg-[#FF5722] text-white font-mono uppercase tracking-[0.18em] text-xs px-6 py-3.5 border border-[#FF5722] hover:bg-[#e64a19]"
                  : "mt-10 btn-secondary"
              }
            >
              {t.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to="/signup"
              data-testid={`pricing-cta-${t.id}`}
              className={
                t.highlight
                  ? "mt-10 inline-flex items-center justify-center gap-2 bg-[#FF5722] text-white font-mono uppercase tracking-[0.18em] text-xs px-6 py-3.5 border border-[#FF5722] hover:bg-[#e64a19]"
                  : "mt-10 btn-secondary"
              }
            >
              {t.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
