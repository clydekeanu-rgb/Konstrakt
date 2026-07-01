import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { PRICING_TIERS } from "@/lib/modules";

const PAYMONGO_URL = "https://paymongo.page/l/konstruph";

export default function PricingTiers() {
  const { user } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();

  const handleSubscribe = () => {
    window.open(PAYMONGO_URL, "_blank");
    toast.info(
      "Complete your payment in the new tab. Your subscription will be activated shortly after verification.",
    );
  };

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
            <span
              className={`cc-label ${t.highlight ? "!text-white/50" : ""}`}
            >
              Tier
            </span>
          </div>
          <p
            className={`text-sm mt-3 ${t.highlight ? "text-white/70" : "text-[#525252]"}`}
          >
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

          <PricingCta
            tier={t}
            user={user}
            isSubscribed={isSubscribed}
            subscriptionLoading={subscriptionLoading}
            onSubscribe={handleSubscribe}
          />
        </article>
      ))}
    </div>
  );
}

function PricingCta({ tier, user, isSubscribed, subscriptionLoading, onSubscribe }) {
  const baseClass = tier.highlight
    ? "mt-10 inline-flex items-center justify-center gap-2 bg-[#FF5722] text-white font-mono uppercase tracking-[0.18em] text-xs px-6 py-3.5 border border-[#FF5722] hover:bg-[#e64a19]"
    : "mt-10 btn-secondary inline-flex items-center justify-center gap-2";

  if (!user) {
    return (
      <Link
        to="/signup"
        data-testid={`pricing-cta-${tier.id}`}
        className={baseClass}
      >
        {tier.cta}
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  if (isSubscribed) {
    return (
      <button
        type="button"
        disabled
        data-testid={`pricing-cta-${tier.id}`}
        className={`${baseClass} opacity-100 cursor-default text-[#002FA7] border-[#002FA7]/30 bg-transparent hover:bg-transparent`}
      >
        Active plan ✓
      </button>
    );
  }

  return (
    <button
      type="button"
      data-testid={`pricing-cta-${tier.id}`}
      onClick={onSubscribe}
      disabled={subscriptionLoading}
      className={`${baseClass} disabled:opacity-60`}
    >
      Subscribe now
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
