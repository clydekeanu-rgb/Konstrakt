import { useMemo, useState } from "react";
import { Home, RotateCcw, ChevronDown, Info } from "lucide-react";

/* ---------- Standard-practice constants (PH residential, rough) ---------- */
// PHP cost per sqm of total floor area, by finish level.
const FINISH = {
  economy: { rate: 22000, label: "Economy", note: "Plain CHB, painted, basic tile, GI roof" },
  standard: { rate: 32000, label: "Standard", note: "Plastered CHB, mixed tile, long-span roof" },
  premium: { rate: 48000, label: "Premium", note: "Premium tile, granite counters, hardwood" },
};

// Per-floor structural premium (suspended slabs, longer columns)
const PER_FLOOR_STRUCTURAL_RATE = 2500; // PHP per sqm of upper-floor area

// Adjustments
const CR_FIXTURE_COST = 40000; // PHP per CR beyond the first
const EXTRA_ROOM_COST = 18000; // PHP per room beyond ~2 rooms per floor
const ROOMS_PER_FLOOR_BASELINE = 2;

// Rough materials per sqm of total floor area (industry rules of thumb)
const MAT = {
  cement: 1.2, // 40 kg bags / sqm
  rebar: 28, // kg / sqm
  chb: 65, // pcs / sqm
  sand: 0.45, // m³ / sqm
  gravel: 0.35, // m³ / sqm
  paint: 0.35, // gallons / sqm
};

// Range band on the headline estimate
const LOW_BAND = 0.85;
const HIGH_BAND = 1.15;

// Crude build duration
// Crude build duration — roughly 22 m² of finished construction per working month
const SQM_PER_MONTH = 22;

const round = (n, p = 0) => {
  const m = Math.pow(10, p);
  return Math.round(n * m) / m;
};
const num = (v, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};
const peso = (n) => "₱ " + Math.round(n).toLocaleString("en-PH");
const pesoCompact = (n) => {
  if (n >= 1_000_000) return "₱ " + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "₱ " + (n / 1_000).toFixed(0) + "K";
  return peso(n);
};

const DEFAULTS = {
  inputMode: "area", // "area" | "dimensions"
  floorArea: 80,
  width: 8,
  length: 10,
  floors: 1,
  rooms: 2,
  cr: 1,
  finish: "standard",
};

export default function QuickHouseEstimator() {
  const [form, setForm] = useState(DEFAULTS);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => setForm(DEFAULTS);

  const r = useMemo(() => {
    const isDim = form.inputMode === "dimensions";
    const width = Math.max(0, num(form.width));
    const length = Math.max(0, num(form.length));
    const areaInput = Math.max(0, num(form.floorArea));
    const floorArea = isDim ? width * length : areaInput;
    const floors = Math.max(1, Math.round(num(form.floors, 1)));
    const rooms = Math.max(0, Math.round(num(form.rooms, 0)));
    const cr = Math.max(0, Math.round(num(form.cr, 0)));
    const finishKey = FINISH[form.finish] ? form.finish : "standard";
    const finish = FINISH[finishKey];

    const totalFloorArea = floorArea * floors;
    const baseCost = totalFloorArea * finish.rate;

    const crAdjustment = Math.max(0, cr - 1) * CR_FIXTURE_COST;
    const expectedRooms = floors * ROOMS_PER_FLOOR_BASELINE;
    const roomAdjustment = Math.max(0, rooms - expectedRooms) * EXTRA_ROOM_COST;

    const upperFloorArea = Math.max(0, totalFloorArea - floorArea);
    const floorPremium = upperFloorArea * PER_FLOOR_STRUCTURAL_RATE;

    const totalEstimate = baseCost + crAdjustment + roomAdjustment + floorPremium;
    const lowEst = totalEstimate * LOW_BAND;
    const highEst = totalEstimate * HIGH_BAND;

    const durationMonths =
      totalFloorArea > 0 ? totalFloorArea / SQM_PER_MONTH : 0;

    return {
      floorArea: round(floorArea, 1),
      totalFloorArea: round(totalFloorArea, 1),
      finishLabel: finish.label,
      finishNote: finish.note,
      perSqm: round(totalEstimate / Math.max(1, totalFloorArea)),
      baseCost,
      crAdjustment,
      roomAdjustment,
      floorPremium,
      total: totalEstimate,
      low: lowEst,
      high: highEst,
      durationMonths: round(durationMonths, 1),
      materials: {
        cement: Math.round(totalFloorArea * MAT.cement),
        rebar: Math.round(totalFloorArea * MAT.rebar),
        chb: Math.round(totalFloorArea * MAT.chb),
        sand: round(totalFloorArea * MAT.sand, 1),
        gravel: round(totalFloorArea * MAT.gravel, 1),
        paint: Math.round(totalFloorArea * MAT.paint),
      },
    };
  }, [form]);

  return (
    <section
      id="quick-estimate"
      data-testid="quick-estimate-section"
      className="border-b border-[#E5E5E5] bg-white relative"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-7">
            <p className="cc-label">[ 05 · Homeowner mode ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              No engineer?
              <br />
              <span className="text-[#FF5722]">No problem.</span>
            </h2>
          </div>
          <div className="md:col-span-5 self-end">
            <p className="text-[#525252] leading-relaxed">
              For homeowners who just want a ballpark. Tell us your floor area
              (or just the width and length), plus the number of rooms, floors
              and CRs — get a rough construction budget in seconds, based on
              standard Philippine practice.
            </p>
          </div>
        </div>

        <div
          data-testid="quick-estimate-card"
          className="border border-[#0A0A0A] grid grid-cols-1 lg:grid-cols-12 bg-white"
        >
          {/* Header */}
          <div className="lg:col-span-12 border-b border-[#0A0A0A] px-6 lg:px-8 py-5 flex items-center justify-between gap-4 bg-[#002FA7] text-white">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 grid place-items-center bg-white text-[#002FA7]">
                <Home className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-display font-bold tracking-tight uppercase text-lg leading-tight">
                  Quick House Estimator
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 mt-0.5">
                  For non-technical users · ballpark only
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              data-testid="quick-estimate-reset"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/80 hover:text-[#FF5722]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Inputs */}
          <div className="lg:col-span-5 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#0A0A0A]">
            <p className="cc-label">House details</p>

            <div className="mt-6 space-y-5">
              {/* Mode toggle */}
              <div>
                <label className="cc-label block mb-2">Floor area input</label>
                <div
                  className="grid grid-cols-2 border border-[#0A0A0A]"
                  data-testid="qe-mode-toggle"
                  role="tablist"
                >
                  {[
                    { v: "area", l: "By area" },
                    { v: "dimensions", l: "By W × L" },
                  ].map((m) => {
                    const active = form.inputMode === m.v;
                    return (
                      <button
                        key={m.v}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        data-testid={`qe-mode-${m.v}`}
                        onClick={() => set("inputMode", m.v)}
                        className={`py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                          active
                            ? "bg-[#0A0A0A] text-white"
                            : "bg-white text-[#0A0A0A] hover:bg-[#F4F4F5]"
                        }`}
                      >
                        {m.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {form.inputMode === "area" ? (
                <NumberField
                  id="floor-area"
                  label="Floor area per floor (m²)"
                  value={form.floorArea}
                  onChange={(v) => set("floorArea", v)}
                  testid="qe-input-area"
                  min={0}
                  step={5}
                  hint="A typical Filipino bungalow is 60–100 m²."
                />
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField
                      id="width"
                      label="Width (m)"
                      value={form.width}
                      onChange={(v) => set("width", v)}
                      testid="qe-input-width"
                      min={0}
                      step={0.5}
                    />
                    <NumberField
                      id="length"
                      label="Length (m)"
                      value={form.length}
                      onChange={(v) => set("length", v)}
                      testid="qe-input-length"
                      min={0}
                      step={0.5}
                    />
                  </div>
                  <p
                    data-testid="qe-computed-area"
                    className="font-mono text-[11px] text-[#525252] mt-2 leading-relaxed"
                  >
                    Floor area ={" "}
                    <span className="text-[#0A0A0A]">{r.floorArea} m²</span>{" "}
                    per floor.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <NumberField
                  id="floors"
                  label="Floors"
                  value={form.floors}
                  onChange={(v) => set("floors", v)}
                  testid="qe-input-floors"
                  min={1}
                  step={1}
                />
                <NumberField
                  id="rooms"
                  label="Rooms"
                  value={form.rooms}
                  onChange={(v) => set("rooms", v)}
                  testid="qe-input-rooms"
                  min={0}
                  step={1}
                />
                <NumberField
                  id="cr"
                  label="CRs"
                  value={form.cr}
                  onChange={(v) => set("cr", v)}
                  testid="qe-input-cr"
                  min={0}
                  step={1}
                />
              </div>

              <div>
                <label htmlFor="finish" className="cc-label block mb-2">
                  Finish level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(FINISH).map(([key, f]) => {
                    const active = form.finish === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        data-testid={`qe-finish-${key}`}
                        onClick={() => set("finish", key)}
                        className={`border text-left p-3 transition-colors ${
                          active
                            ? "border-[#002FA7] bg-[#002FA7] text-white"
                            : "border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F4F4F5]"
                        }`}
                      >
                        <p className="font-display font-bold uppercase text-sm tracking-tight">
                          {f.label}
                        </p>
                        <p
                          className={`font-mono text-[10px] uppercase tracking-[0.18em] mt-1 ${
                            active ? "text-white/70" : "text-[#525252]"
                          }`}
                        >
                          ₱{(f.rate / 1000).toFixed(0)}K / m²
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="font-mono text-[11px] text-[#525252] mt-3 leading-relaxed">
                  {r.finishNote}
                </p>
              </div>
            </div>

            <div className="mt-8 border border-[#FF5722] bg-[#FF5722]/5 p-4 flex gap-3">
              <Info className="w-4 h-4 mt-0.5 text-[#FF5722] shrink-0" strokeWidth={2.5} />
              <p className="font-mono text-[11px] text-[#0A0A0A] leading-relaxed">
                <span className="uppercase tracking-[0.18em] text-[#FF5722]">
                  Ballpark only.
                </span>{" "}
                Use this for budgeting feel. A real estimate needs site
                conditions, soil, finishes and a proper BOQ.
              </p>
            </div>
          </div>

          {/* Output */}
          <div
            data-testid="quick-estimate-output"
            className="lg:col-span-7 p-6 lg:p-10 bg-[#0A0A0A] text-white relative"
          >
            <div className="absolute inset-0 blueprint-grid-dark opacity-60 pointer-events-none" />
            <div className="relative">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="cc-label !text-white/50">Estimated total</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                  Total floor area · {r.totalFloorArea} m²
                </p>
              </div>

              <p
                data-testid="qe-out-total"
                className="font-display font-black tracking-tighter mt-3 text-6xl sm:text-7xl lg:text-[7.5rem] leading-[0.85]"
              >
                {pesoCompact(r.total)}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y border-white/15 py-4">
                <Range label="Low" v={r.low} testid="qe-out-low" />
                <Range label="High" v={r.high} testid="qe-out-high" highlight />
                <Range label="Per m²" v={r.perSqm} testid="qe-out-persqm" />
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                    Build time
                  </span>
                  <span
                    data-testid="qe-out-duration"
                    className="font-mono text-base"
                  >
                    {r.durationMonths} mo
                  </span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="mt-8">
                <p className="cc-label !text-white/50">Cost breakdown</p>
                <ul className="mt-3 divide-y divide-white/10 border-y border-white/15">
                  <BreakRow
                    label={`${r.finishLabel} build (${r.totalFloorArea} m²)`}
                    value={r.baseCost}
                    testid="qe-out-base"
                  />
                  {r.floorPremium > 0 && (
                    <BreakRow
                      label="Upper-floor structural premium"
                      value={r.floorPremium}
                      testid="qe-out-floor-premium"
                    />
                  )}
                  {r.crAdjustment > 0 && (
                    <BreakRow
                      label="Extra CR fixtures"
                      value={r.crAdjustment}
                      testid="qe-out-cr-adj"
                    />
                  )}
                  {r.roomAdjustment > 0 && (
                    <BreakRow
                      label="Extra rooms (above baseline)"
                      value={r.roomAdjustment}
                      testid="qe-out-room-adj"
                    />
                  )}
                </ul>
              </div>

              {/* Materials preview */}
              <div className="mt-8">
                <p className="cc-label !text-white/50">Rough materials</p>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <MatCell label="Cement" v={r.materials.cement} unit="bags" testid="qe-mat-cement" />
                  <MatCell label="Rebar" v={r.materials.rebar} unit="kg" testid="qe-mat-rebar" />
                  <MatCell label="CHB" v={r.materials.chb} unit="pcs" testid="qe-mat-chb" />
                  <MatCell label="Sand" v={r.materials.sand} unit="m³" testid="qe-mat-sand" />
                  <MatCell label="Gravel" v={r.materials.gravel} unit="m³" testid="qe-mat-gravel" />
                  <MatCell label="Paint" v={r.materials.paint} unit="gal" testid="qe-mat-paint" />
                </div>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mt-8 leading-relaxed">
                Heuristic estimate · standard PH practice · ± 15% band. Not a
                substitute for a site-specific BOQ.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-[#525252] max-w-2xl leading-relaxed">
          Need a real takeoff with material counts and a proper BOQ? Try the
          full Konstru — 14 modules, line-by-line quantities, line-by-line
          pricing.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Reusable cells ---------------- */

function NumberField({ id, label, value, onChange, testid, min = 0, step = 1, hint }) {
  return (
    <div>
      <label htmlFor={id} className="cc-label block mb-2">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        data-testid={testid}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-[#0A0A0A] px-3.5 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
      />
      {hint && (
        <p className="font-mono text-[10px] text-[#525252] mt-2 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

function Range({ label, v, testid, highlight }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
        {label}
      </span>
      <span
        data-testid={testid}
        className={`font-mono text-base ${highlight ? "text-[#FF5722]" : ""}`}
      >
        {pesoCompact(v)}
      </span>
    </div>
  );
}

function BreakRow({ label, value, testid }) {
  return (
    <li
      data-testid={testid}
      className="flex items-center justify-between gap-4 py-3"
    >
      <span className="font-mono text-sm text-white/85">{label}</span>
      <span className="font-mono text-base">{peso(value)}</span>
    </li>
  );
}

function MatCell({ label, v, unit, testid }) {
  return (
    <div className="border border-white/20 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
        {label}
      </p>
      <p data-testid={testid} className="font-mono text-lg mt-1">
        {v}
        <span className="text-white/50 text-xs ml-1">{unit}</span>
      </p>
    </div>
  );
}
