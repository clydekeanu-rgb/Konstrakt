<<<<<<< HEAD
import { useLocation } from "react-router-dom";
=======
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTiers from "@/components/PricingTiers";

export default function Pricing() {
<<<<<<< HEAD
  const location = useLocation();
  const showPaywallNotice = location.state?.reason === "paywall";

  return (
    <main className="bg-white text-[#0A0A0A]">
      <Navbar />
      <section
        data-testid="pricing-page"
        className="border-b border-[#E5E5E5]"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          {showPaywallNotice && (
            <div
              data-testid="paywall-notice"
              className="mb-10 border-l-4 border-[#FF5722] bg-[#FFF8F5] px-6 py-4"
            >
              <p className="cc-label">
                You need an active plan to access Konstru. Subscribe below to
                continue.
              </p>
            </div>
          )}

=======
  return (
    <main data-testid="pricing-page" className="bg-white text-[#0A0A0A]">
      <Navbar />
      <section className="border-b border-[#E5E5E5]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-7">
              <p className="cc-label">[ Pricing ]</p>
              <h1 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
                Priced for
                <br />
                <span className="text-[#002FA7]">PH practice.</span>
              </h1>
            </div>
            <div className="md:col-span-5 self-end">
              <p className="text-[#525252] leading-relaxed">
<<<<<<< HEAD
                Monthly billing in Philippine Pesos. Cancel anytime — your
                projects stay yours. No annual lock-in, no quote-based
                &ldquo;contact us&rdquo; tier.
=======
                Monthly billing in Philippine Pesos. Cancel anytime - your
                projects stay yours. No annual lock-in, no quote-based &ldquo;contact
                us&rdquo; tier.
>>>>>>> 9a99d29858d4e1a91ddcfbb56bc3cdd87750566c
              </p>
            </div>
          </div>

          <PricingTiers />
        </div>
      </section>
      <Footer />
    </main>
  );
}
