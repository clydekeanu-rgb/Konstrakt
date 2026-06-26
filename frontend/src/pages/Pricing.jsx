import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTiers from "@/components/PricingTiers";

export default function Pricing() {
  return (
    <main data-testid="pricing-page" className="bg-white text-[#0A0A0A]">
      <Navbar />
      <section className="border-b border-[#E5E5E5]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
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
                Monthly billing in Philippine Pesos. Cancel anytime - your
                projects stay yours. No annual lock-in, no quote-based &ldquo;contact
                us&rdquo; tier.
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
