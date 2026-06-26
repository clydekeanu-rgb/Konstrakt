// 14 Konstru calculation modules across 5 categories
export const MODULE_CATEGORIES = [
  {
    id: "earthworks",
    code: "01",
    title: "Earthworks & Substructure",
    blurb:
      "Below-grade work — footprints, footings, excavation volumes, backfill, gravel bedding.",
    modules: [{ name: "Footing", unit: "m³" }],
  },
  {
    id: "structural-concrete",
    code: "02",
    title: "Structural Concrete",
    blurb:
      "Columns, beams, slabs and stairs — concrete volume, rebar schedules in 6 m bars, tie wire, formwork.",
    modules: [
      { name: "Column", unit: "m³" },
      { name: "Beam", unit: "m³" },
      { name: "Slab on Fill", unit: "m²" },
      { name: "Suspended Slab (One-Way)", unit: "m²" },
      { name: "Suspended Slab (Two-Way)", unit: "m²" },
      { name: "Concrete Stairs", unit: "flight" },
    ],
  },
  {
    id: "masonry",
    code: "03",
    title: "Masonry",
    blurb:
      "CHB block walls with openings, mortar, plastering — split by 4″ and 6″ block thickness.",
    modules: [{ name: "Wall (CHB)", unit: "m²" }],
  },
  {
    id: "finishes",
    code: "04",
    title: "Finishes",
    blurb:
      "Surface work — tile coverage, paint gallons by area and substrate, suspended ceilings, drywall.",
    modules: [
      { name: "Tiling", unit: "m²" },
      { name: "Paint (Concrete)", unit: "m²" },
      { name: "Paint (Wood)", unit: "m²" },
      { name: "Ceiling", unit: "m²" },
      { name: "Drywall Partition", unit: "m²" },
    ],
  },
  {
    id: "site-other",
    code: "05",
    title: "Site & Other",
    blurb:
      "Roofing sheets and accessories, scaffolding sets, riprap stone volumes for embankments.",
    modules: [
      { name: "Roofing", unit: "m²" },
      { name: "Scaffolding", unit: "set" },
      { name: "Riprapping", unit: "m³" },
    ],
  },
];

export const ALL_MODULES = MODULE_CATEGORIES.flatMap((c) =>
  c.modules.map((m) => ({ ...m, category: c.title })),
);

export const PRICING_TIERS = [
  {
    id: "weekly",
    name: "Weekly",
    price: "₱299",
    cadence: "/ 1 week",
    tagline: "All access, short commitment.",
    features: [
      "All 14 calculation modules",
      "All tabs unlocked",
      "All future versions & updates",
      "Unlimited elements & projects",
      "Full BOQ with PHP pricing",
      "PDF & Excel export",
    ],
    cta: "Get 1-week access",
    highlight: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₱499",
    cadence: "/ 1 month",
    tagline: "All access for a full month.",
    features: [
      "Everything in Weekly",
      "All 14 calculation modules",
      "All tabs unlocked",
      "All future versions & updates",
      "Unlimited elements & projects",
      "PDF & Excel export",
    ],
    cta: "Get 1-month access",
    highlight: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₱4,999",
    cadence: "/ 1 year",
    tagline: "Best value — plus insider perks.",
    features: [
      "Everything in Monthly",
      "Free newsletter on latest updates",
      "First to try new features (beta access)",
      "Suggest new features directly to the team",
      "All future versions & updates",
      "12 months · best ₱/month rate",
    ],
    cta: "Get 1-year access",
    highlight: true,
  },
];

export const FAQS = [
  {
    q: "Is Konstru tuned for Philippine construction practice?",
    a: "Yes. Default rebar lengths are 6 m commercial bars, CHB is split into 4″ and 6″, cement is computed in 40 kg bags, and all costs are reported in Philippine Peso (₱).",
  },
  {
    q: "Does it replace a quantity surveyor?",
    a: "No. Konstru gives you a fast, defensible takeoff from rough dimensions. A QS still adds judgment, wastage assumptions specific to your site, and contract math. Konstru is the calculator — not the contract.",
  },
  {
    q: "Where does pricing data come from?",
    a: "You bring your own price list. Konstru ships with editable defaults for cement, sand, gravel, rebar, CHB, tiles, paint and roofing. Update them once — the entire BOQ recalculates.",
  },
  {
    q: "Can I add multiple footings, walls, or slabs?",
    a: "Yes. Every module supports multiple instances — “Wall #1”, “Wall #2”, “Footing #3” — each tracked separately and aggregated into the project BOQ.",
  },
  {
    q: "Is my data stored on a server?",
    a: "Konstru runs client-side. Your inputs stay in your browser unless you explicitly create a Pro account to sync projects across devices.",
  },
  {
    q: "Do you support metric and imperial units?",
    a: "Konstru is metric-first (m, m², m³, kg, bags). CHB thickness is given in inches (4″, 6″) because that is how it ships from PH suppliers.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Cut my takeoff time from two days to twenty minutes. The CHB split by 4 inch and 6 inch alone saved me from three rework arguments with the foreman.",
    name: "Maria Santos",
    role: "Site Engineer · Quezon City",
    image: "https://images.unsplash.com/photo-1690166444493-b3f5fbcd4762",
  },
  {
    quote:
      "I price two-storey residential builds every week. Konstru gives me a BOQ in PHP that the homeowner can actually read. That is the whole job.",
    name: "Joaquin Reyes",
    role: "Licensed Civil Engineer · Cebu",
    image: "https://images.unsplash.com/photo-1661263989552-d82526d03b0f",
  },
];
