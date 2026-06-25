import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  Check,
  Ruler,
  ClipboardList,
  Receipt,
  Quote,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import WallCalcDemo from "@/components/WallCalcDemo";
import QuickHouseEstimator from "@/components/QuickHouseEstimator";
import {
  MODULE_CATEGORIES,
  PRICING_TIERS,
  FAQS,
  TESTIMONIALS,
  ALL_MODULES,
} from "@/lib/modules";

const HERO_BG = "https://images.pexels.com/photos/10951145/pexels-photo-10951145.jpeg";
const BLUEPRINT_BG = "https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg";

export default function Landing() {
  return (
    <main className="bg-white text-[#0A0A0A]">
      <Navbar />
      <Hero />
      <Marquee />
      <Stats />
      <Features />
      <HowItWorks />
      <WallCalcDemo />
      <QuickHouseEstimator />
      <SampleBOQ />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}

/* ---------------------------- HERO ---------------------------- */
function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative overflow-hidden border-b border-[#E5E5E5]"
    >
      {/* BG image */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white" />
      </div>
      <div className="absolute inset-0 blueprint-grid pointer-events-none" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 lg:pt-28 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-9">
            <p className="cc-label" data-testid="hero-eyeline">
              [ 01 · Quantity Takeoff &amp; BOQ Engine · Philippines ]
            </p>
            <h1
              data-testid="hero-headline"
              className="font-display font-black tracking-tighter uppercase mt-6 leading-[0.85] text-[clamp(3.25rem,10vw,10rem)]"
            >
              Stop guessing.
              <br />
              Start <span className="text-[#002FA7]">building.</span>
            </h1>
            <p
              data-testid="hero-sub"
              className="mt-8 max-w-2xl text-base sm:text-lg text-[#525252] leading-relaxed"
            >
              ConsCalc turns rough dimensions into a defensible bill of
              materials and a project-wide BOQ — priced in Philippine Pesos.
              Cement bags, 6-meter rebar counts, CHB blocks at 4″ and 6″,
              gallons of paint, sheets of plywood. No spreadsheets. No
              arithmetic by hand.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                data-testid="hero-cta-primary"
                className="btn-primary"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how"
                data-testid="hero-cta-secondary"
                className="btn-secondary"
              >
                See how it works
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spec sheet card */}
          <div className="md:col-span-3 hidden md:block">
            <div className="border border-[#0A0A0A] bg-white p-6">
              <p className="cc-label">Spec sheet</p>
              <ul className="mt-5 space-y-3 font-mono text-sm">
                <SpecRow k="Modules" v="14" />
                <SpecRow k="Categories" v="5" />
                <SpecRow k="Currency" v="PHP" />
                <SpecRow k="Rebar bar" v="6.0 m" />
                <SpecRow k="Cement bag" v="40 kg" />
                <SpecRow k="CHB" v="4″ / 6″" />
                <SpecRow k="Output" v="BOM + BOQ" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function SpecRow({ k, v }) {
  return (
    <li className="flex items-baseline justify-between border-b border-dashed border-[#E5E5E5] pb-2">
      <span className="text-[#525252] text-xs uppercase tracking-[0.18em]">
        {k}
      </span>
      <span className="text-[#0A0A0A]">{v}</span>
    </li>
  );
}

/* ---------------------------- STATS ---------------------------- */
function Stats() {
  const items = [
    { n: "14", l: "Calculation modules" },
    { n: "5", l: "Project categories" },
    { n: "₱", l: "Philippine Peso native" },
    { n: "0", l: "Spreadsheets needed" },
  ];
  return (
    <section className="border-b border-[#E5E5E5]">
      <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={i}
            className={`p-8 lg:p-10 ${i < 3 ? "md:border-r" : ""} ${
              i < 2 ? "border-b md:border-b-0" : ""
            } border-[#E5E5E5]`}
          >
            <p className="font-display font-black tracking-tighter text-5xl lg:text-6xl">
              {it.n}
            </p>
            <p className="cc-label mt-3">{it.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- FEATURES ---------------------------- */
function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative border-b border-[#E5E5E5]"
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url(${BLUEPRINT_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <p className="cc-label">[ 02 · Modules ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              Fourteen
              <br />
              <span className="text-[#002FA7]">calculators.</span>
              <br />
              One engine.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 self-end">
            <p className="text-[#525252] text-base sm:text-lg leading-relaxed">
              Each module is a self-contained mini-calculator. Add several
              walls, several footings, several slabs — every instance is
              tracked separately, then aggregated into a single project-wide
              bill of quantities.
            </p>
          </div>
        </div>

        {/* Categories grid — Tetris */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-l border-t border-[#E5E5E5]">
          {MODULE_CATEGORIES.map((cat, i) => {
            const span =
              i === 1
                ? "md:col-span-7"
                : i === 0
                  ? "md:col-span-5"
                  : i === 2
                    ? "md:col-span-4"
                    : i === 3
                      ? "md:col-span-5"
                      : "md:col-span-3";
            return (
              <article
                key={cat.id}
                data-testid={`module-cat-${cat.id}`}
                className={`cc-card border-r border-b border-[#E5E5E5] !border-l-0 !border-t-0 p-8 lg:p-10 ${span}`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="cc-label">[ {cat.code} ]</span>
                  <span className="font-mono text-xs text-[#525252]">
                    {cat.modules.length} {cat.modules.length === 1 ? "module" : "modules"}
                  </span>
                </div>
                <h3 className="font-display font-bold tracking-tight uppercase text-2xl sm:text-3xl mt-6 leading-tight">
                  {cat.title}
                </h3>
                <p className="mt-4 text-[#525252] text-sm leading-relaxed">
                  {cat.blurb}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {cat.modules.map((m) => (
                    <li
                      key={m.name}
                      className="font-mono text-xs uppercase tracking-[0.14em] border border-[#0A0A0A] px-3 py-1.5"
                    >
                      {m.name}
                      <span className="text-[#525252] ml-2">/ {m.unit}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Modules summary count */}
        <div className="mt-10 border-l-2 border-[#FF5722] pl-6">
          <p className="font-mono text-sm text-[#525252]">
            Total modules indexed:{" "}
            <span className="text-[#0A0A0A] font-semibold">
              {ALL_MODULES.length}
            </span>{" "}
            · across{" "}
            <span className="text-[#0A0A0A] font-semibold">
              {MODULE_CATEGORIES.length}
            </span>{" "}
            categories.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- HOW IT WORKS ---------------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Ruler,
      title: "Input dimensions",
      body: "Pick a module — Footing, Wall, Slab, Tiling. Enter rough dimensions: length, height, thickness, bar diameter, spacing, mix class. Add another instance if you have more than one.",
    },
    {
      n: "02",
      icon: ClipboardList,
      title: "Get the Bill of Materials",
      body: "ConsCalc converts geometry into materials: concrete volumes, cement bags at 40 kg, sand and gravel by m³, rebar pieces from linear meters in 6 m bars, CHB pieces, plywood sheets, paint gallons.",
    },
    {
      n: "03",
      icon: Receipt,
      title: "Read the BOQ in PHP",
      body: "Every instance rolls up into a single Bill of Quantities. Steel is split by 10/12/16/20 mm and converted to kg. Masonry is split by CHB thickness. Subtotals and grand total appear in Philippine Pesos.",
    },
  ];

  return (
    <section
      id="how"
      data-testid="how-section"
      className="border-b border-[#E5E5E5]"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <p className="cc-label">[ 03 · Method ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              Dimensions
              <br />
              in.{" "}
              <span className="text-[#FF5722]">
                Estimate
                <br />
                out.
              </span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 self-end">
            <p className="text-[#525252] text-base sm:text-lg leading-relaxed">
              The takeoff math you used to do on graphing paper. The unit
              conversions you used to keep in a sticky note. The pricing you
              used to copy-paste from last month’s job. All of it — in three
              steps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E5E5E5]">
          {steps.map((s) => (
            <article
              key={s.n}
              data-testid={`step-${s.n}`}
              className="border-r border-b border-[#E5E5E5] p-8 lg:p-12 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-black tracking-tighter text-7xl lg:text-8xl text-[#F4F4F5] leading-none">
                  {s.n}
                </span>
                <s.icon className="w-7 h-7 text-[#002FA7]" strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-bold tracking-tight uppercase text-2xl mt-2">
                {s.title}
              </h3>
              <p className="mt-4 text-[#525252] leading-relaxed text-sm">
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- SAMPLE BOQ ---------------------------- */
function SampleBOQ() {
  return (
    <section className="border-b border-[#E5E5E5] bg-[#0A0A0A] text-white relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid-dark pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="cc-label !text-white/50">[ 06 · Sample output ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
            One screen.
            <br />
            The whole
            <br />
            <span className="text-[#FF5722]">project.</span>
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed max-w-md">
            A real BOQ rollup from a two-storey residential project — pulled
            out of ConsCalc with no manual arithmetic.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="border border-white/20 bg-white/[0.03] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                BOQ_SUMMARY · 2S_RESIDENTIAL.PH
              </p>
              <span className="font-mono text-xs text-[#FF5722]">DRAFT</span>
            </div>
            <ul className="divide-y divide-white/10">
              {[
                ["Earthworks", "Excavation, gravel bedding, backfill", "₱ 184,520"],
                ["Structural Concrete", "Columns, beams, slabs, stairs", "₱ 612,300"],
                ["Rebar (10/12/16/20 mm)", "2,418 kg total", "₱ 268,990"],
                ["Masonry (CHB 4″ + 6″)", "318 m² incl. plastering", "₱ 192,740"],
                ["Finishes", "Tile, paint, ceiling, drywall", "₱ 311,860"],
                ["Roofing", "Long-span GI · 142 m²", "₱ 178,400"],
              ].map(([k, v, p], i) => (
                <li key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm">{k}</p>
                    <p className="font-mono text-xs text-white/50 mt-1">{v}</p>
                  </div>
                  <span className="font-mono text-base">{p}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/20 px-6 py-5 flex items-center justify-between">
              <p className="cc-label !text-white/60">Grand total</p>
              <p className="font-display font-black text-3xl tracking-tighter">
                ₱ 1.75M
              </p>
            </div>
          </div>
          <p className="font-mono text-xs text-white/40 mt-4">
            * Indicative figures for demonstration only.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- PRICING ---------------------------- */
function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="border-b border-[#E5E5E5]"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-7">
            <p className="cc-label">[ 07 · Pricing ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              Priced for
              <br />
              <span className="text-[#002FA7]">PH practice.</span>
            </h2>
          </div>
          <div className="md:col-span-5 self-end">
            <p className="text-[#525252] leading-relaxed">
              Monthly billing in Philippine Pesos. Cancel anytime — your
              projects stay yours. No annual lock-in, no quote-based &ldquo;contact
              us&rdquo; tier.
            </p>
          </div>
        </div>

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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TESTIMONIALS ---------------------------- */
function Testimonials() {
  return (
    <section
      data-testid="testimonials-section"
      className="border-b border-[#E5E5E5] bg-[#F4F4F5]"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-7">
            <p className="cc-label">[ 08 · Voices from site ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              From the
              <br />
              <span className="text-[#002FA7]">scaffolding.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-[#E5E5E5]">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={i}
              data-testid={`testimonial-${i}`}
              className="border-r border-b border-[#E5E5E5] p-8 lg:p-12 bg-white"
            >
              <Quote
                className="w-8 h-8 text-[#FF5722]"
                strokeWidth={1.5}
              />
              <p className="mt-6 font-display text-xl sm:text-2xl leading-snug tracking-tight">
                “{t.quote}”
              </p>
              <div className="mt-10 flex items-center gap-4 pt-6 border-t border-[#E5E5E5]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 object-cover grayscale"
                />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="cc-label mt-1">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- FAQ ---------------------------- */
function FAQ() {
  return (
    <section id="faq" data-testid="faq-section" className="border-b border-[#E5E5E5]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="cc-label">[ 09 · FAQ ]</p>
          <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
            Honest
            <br />
            answers.
          </h2>
          <p className="mt-6 text-[#525252] leading-relaxed max-w-md">
            Questions Filipino engineers, contractors and homeowners actually
            ask before they trust an estimate to a piece of software.
          </p>
        </div>
        <div className="md:col-span-7">
          <Accordion type="single" collapsible className="border-t border-[#0A0A0A]">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                data-testid={`faq-item-${i}`}
                className="border-b border-[#E5E5E5]"
              >
                <AccordionTrigger className="text-left font-display font-semibold uppercase tracking-tight text-lg sm:text-xl py-6 hover:no-underline hover:text-[#002FA7]">
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[#525252]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#525252] text-base leading-relaxed pb-6 pr-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
