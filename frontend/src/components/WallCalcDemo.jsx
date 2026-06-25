import { useMemo, useState } from "react";
import { Calculator, RotateCcw, ChevronDown } from "lucide-react";

/* ---------------------- Calculation constants ---------------------- */
const BAR_LENGTH_M = 6;
const TIE_WIRE_INTERSECTIONS_PER_KG = 53;
const CHB_AREA_PER_PIECE = 0.0924;
const CHB_4_MORTAR_CEMENT = 0.525; // bags per sqm
const CHB_6_MORTAR_CEMENT = 1.013;
const CHB_4_MORTAR_SAND = 0.0438; // cu.m per sqm
const CHB_6_MORTAR_SAND = 0.085;
const WALL_TIE_WIRE_PER_INTERSECTION = 0.3;
const WALL_PLASTER_CEMENT = 0.288; // bags per sqm per face
const WALL_PLASTER_SAND = 0.16; // cu.m per sqm per face

const WALL_VERT_BAR_LM = { 40: 2.93, 60: 2.13, 80: 1.6 };
const WALL_HORIZ_BAR_LM = { 2: 3.3, 3: 2.15, 4: 1.72 };

const round2 = (n) => Math.round(n * 100) / 100;
const num = (v, fallback = 0) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

const DEFAULTS = {
  length: 6,
  height: 3,
  chb: "4",
  vSpacing: "60",
  hLayers: "2",
  barDiameter: "10mm",
  plastering: true,
  plasterFaces: 2,
  openingWidth: 0.9,
  openingHeight: 2.1,
  openingCount: 1,
};

export default function WallCalcDemo() {
  const [form, setForm] = useState(DEFAULTS);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => setForm(DEFAULTS);

  const r = useMemo(() => {
    const length = Math.max(0, num(form.length));
    const height = Math.max(0, num(form.height));
    const oW = Math.max(0, num(form.openingWidth));
    const oH = Math.max(0, num(form.openingHeight));
    const oC = Math.max(0, num(form.openingCount));
    const plasterFaces = Math.min(2, Math.max(1, Math.round(num(form.plasterFaces, 2))));

    const grossArea = length * height;
    const openingArea = oW * oH * oC;
    const netArea = Math.max(0, grossArea - openingArea);

    const mortarCement =
      form.chb === "4"
        ? netArea * CHB_4_MORTAR_CEMENT
        : netArea * CHB_6_MORTAR_CEMENT;
    const mortarSand =
      form.chb === "4"
        ? netArea * CHB_4_MORTAR_SAND
        : netArea * CHB_6_MORTAR_SAND;

    const vPerSqm = WALL_VERT_BAR_LM[form.vSpacing] ?? 0;
    const hPerSqm = WALL_HORIZ_BAR_LM[form.hLayers] ?? 0;
    const vertBarRawLength = vPerSqm * netArea;
    const horizBarRawLength = hPerSqm * netArea;

    const vertIntersections = length * vPerSqm;
    const horizIntersections = height * (Number(form.hLayers) * 0.20);

    const chbPieces =
      netArea > 0 ? Math.ceil(netArea / CHB_AREA_PER_PIECE) : 0;
    const vertBars =
      vertBarRawLength > 0 ? Math.ceil(vertBarRawLength / BAR_LENGTH_M) : 0;
    const horizBars =
      horizBarRawLength > 0 ? Math.ceil(horizBarRawLength / BAR_LENGTH_M) : 0;

    const tieWireKg = round2(
      (vertIntersections * horizIntersections * WALL_TIE_WIRE_PER_INTERSECTION) /
        TIE_WIRE_INTERSECTIONS_PER_KG,
    );

    const plasterCement = form.plastering
      ? round2(netArea * WALL_PLASTER_CEMENT * plasterFaces)
      : 0;
    const plasterSand = form.plastering
      ? round2(netArea * WALL_PLASTER_SAND * plasterFaces)
      : 0;

    return {
      grossArea: round2(grossArea),
      openingArea: round2(openingArea),
      netArea: round2(netArea),
      chbPieces,
      mortarCement: round2(mortarCement),
      mortarSand: round2(mortarSand),
      vertBars,
      horizBars,
      tieWireKg,
      plasterCement,
      plasterSand,
    };
  }, [form]);

  return (
    <section
      id="try-it"
      data-testid="wall-calc-section"
      className="border-b border-[#E5E5E5] bg-[#F4F4F5] relative"
    >
      <div className="absolute inset-0 blueprint-grid opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-7">
            <p className="cc-label">[ 04 · Live demo ]</p>
            <h2 className="font-display font-black tracking-tighter uppercase mt-6 text-5xl sm:text-6xl leading-[0.9]">
              Try it.
              <br />
              <span className="text-[#002FA7]">Right here.</span>
            </h2>
          </div>
          <div className="md:col-span-5 self-end">
            <p className="text-[#525252] leading-relaxed">
              A real CHB wall takeoff — running entirely in your browser.
              Adjust the dimensions and watch the materials update live.{" "}
              <span className="text-[#0A0A0A]">
                The full version includes 13 more calculators, project
                aggregation, and pricing in PHP.
              </span>
            </p>
          </div>
        </div>

        {/* Calculator card */}
        <div
          data-testid="wall-calc-card"
          className="bg-white border border-[#0A0A0A] grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Header bar */}
          <div className="lg:col-span-12 border-b border-[#0A0A0A] px-6 lg:px-8 py-5 flex items-center justify-between gap-4 bg-[#0A0A0A] text-white">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 grid place-items-center bg-white text-[#0A0A0A]">
                <Calculator className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="font-display font-bold tracking-tight uppercase text-lg leading-tight">
                  Wall Material Calculator
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 mt-0.5">
                  Module 03 · Masonry · CHB · Live demo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              data-testid="wall-calc-reset"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 hover:text-[#FF5722]"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Inputs */}
          <div className="lg:col-span-7 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#0A0A0A]">
            <p className="cc-label">Inputs</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <NumberField
                id="length"
                label="Length (m)"
                value={form.length}
                onChange={(v) => set("length", v)}
                testid="wall-input-length"
                min={0}
                step={0.1}
              />
              <NumberField
                id="height"
                label="Height (m)"
                value={form.height}
                onChange={(v) => set("height", v)}
                testid="wall-input-height"
                min={0}
                step={0.1}
              />
              <SelectField
                id="chb"
                label='CHB size (inches)'
                value={form.chb}
                onChange={(v) => set("chb", v)}
                testid="wall-input-chb"
                options={[
                  { value: "4", label: '4" CHB' },
                  { value: "6", label: '6" CHB' },
                ]}
              />
              <SelectField
                id="vSpacing"
                label="Vertical bar spacing (cm)"
                value={form.vSpacing}
                onChange={(v) => set("vSpacing", v)}
                testid="wall-input-vspacing"
                options={[
                  { value: "40", label: "40 cm" },
                  { value: "60", label: "60 cm" },
                  { value: "80", label: "80 cm" },
                ]}
              />
              <SelectField
                id="hLayers"
                label="Horizontal bar layers"
                value={form.hLayers}
                onChange={(v) => set("hLayers", v)}
                testid="wall-input-hlayers"
                options={[
                  { value: "2", label: "2 layers" },
                  { value: "3", label: "3 layers" },
                  { value: "4", label: "4 layers" },
                ]}
              />
              <SelectField
                id="barDiameter"
                label="Bar diameter"
                value={form.barDiameter}
                onChange={(v) => set("barDiameter", v)}
                testid="wall-input-bardiameter"
                options={[
                  { value: "10mm", label: "10 mm" },
                  { value: "12mm", label: "12 mm" },
                  { value: "16mm", label: "16 mm" },
                  { value: "20mm", label: "20 mm" },
                ]}
              />
            </div>

            {/* Plastering */}
            <div className="mt-8 pt-6 border-t border-dashed border-[#E5E5E5]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="cc-label">Plastering</p>
                  <p className="font-mono text-xs text-[#525252] mt-1">
                    Apply plaster finish to the wall surface(s).
                  </p>
                </div>
                <Toggle
                  checked={form.plastering}
                  onChange={(v) => set("plastering", v)}
                  testid="wall-input-plastering"
                />
              </div>

              {form.plastering && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField
                    id="plasterFaces"
                    label="Plaster faces"
                    value={String(form.plasterFaces)}
                    onChange={(v) => set("plasterFaces", parseInt(v, 10))}
                    testid="wall-input-plasterfaces"
                    options={[
                      { value: "1", label: "1 face" },
                      { value: "2", label: "2 faces (both sides)" },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Opening */}
            <div className="mt-8 pt-6 border-t border-dashed border-[#E5E5E5]">
              <p className="cc-label">Opening (door / window)</p>
              <p className="font-mono text-xs text-[#525252] mt-1">
                Set count to 0 for a solid wall.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <NumberField
                  id="openingWidth"
                  label="Width (m)"
                  value={form.openingWidth}
                  onChange={(v) => set("openingWidth", v)}
                  testid="wall-input-opening-width"
                  min={0}
                  step={0.1}
                />
                <NumberField
                  id="openingHeight"
                  label="Height (m)"
                  value={form.openingHeight}
                  onChange={(v) => set("openingHeight", v)}
                  testid="wall-input-opening-height"
                  min={0}
                  step={0.1}
                />
                <NumberField
                  id="openingCount"
                  label="Count"
                  value={form.openingCount}
                  onChange={(v) => set("openingCount", v)}
                  testid="wall-input-opening-count"
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div
            data-testid="wall-calc-output"
            className="lg:col-span-5 p-6 lg:p-10 bg-[#0A0A0A] text-white relative"
          >
            <div className="absolute inset-0 blueprint-grid-dark opacity-60 pointer-events-none" />
            <div className="relative">
              <p className="cc-label !text-white/50">Bill of Materials</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mt-1">
                Updates live · quantities only
              </p>

              {/* Area summary */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <AreaCell
                  label="Gross"
                  value={r.grossArea}
                  unit="m²"
                  testid="wall-out-gross"
                />
                <AreaCell
                  label="Opening"
                  value={r.openingArea}
                  unit="m²"
                  testid="wall-out-opening"
                  muted
                />
                <AreaCell
                  label="Net"
                  value={r.netArea}
                  unit="m²"
                  testid="wall-out-net"
                  accent
                />
              </div>

              {/* Materials list */}
              <ul className="mt-8 divide-y divide-white/10 border-y border-white/15">
                <Row
                  label={`${form.chb}" CHB`}
                  value={r.chbPieces}
                  unit="pcs"
                  testid="wall-out-chb"
                />
                <Row
                  label="Mortar Cement"
                  value={r.mortarCement}
                  unit="bags"
                  testid="wall-out-mortar-cement"
                />
                <Row
                  label="Mortar Sand"
                  value={r.mortarSand}
                  unit="m³"
                  testid="wall-out-mortar-sand"
                />
                <Row
                  label={`${form.barDiameter} Vertical Bars`}
                  value={r.vertBars}
                  unit="pcs @ 6 m"
                  testid="wall-out-vert-bars"
                />
                <Row
                  label={`${form.barDiameter} Horizontal Bars`}
                  value={r.horizBars}
                  unit="pcs @ 6 m"
                  testid="wall-out-horiz-bars"
                />
                <Row
                  label="Tie Wire"
                  value={r.tieWireKg}
                  unit="kg"
                  testid="wall-out-tie-wire"
                />
                {form.plastering && (
                  <>
                    <Row
                      label="Plaster Cement"
                      value={r.plasterCement}
                      unit="bags"
                      testid="wall-out-plaster-cement"
                    />
                    <Row
                      label="Plaster Sand"
                      value={r.plasterSand}
                      unit="m³"
                      testid="wall-out-plaster-sand"
                    />
                  </>
                )}
              </ul>

              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mt-6 leading-relaxed">
                Simplified demo constants. The full Wall module adds wastage,
                lapping, corner factors and PHP pricing.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-[#525252] max-w-2xl leading-relaxed">
          Live demo — the full version includes 13 more calculators, custom
          pricing, and project-wide cost estimates in Philippine Pesos.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Fields ----------------------------- */

function NumberField({ id, label, value, onChange, testid, min = 0, step = 1 }) {
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
    </div>
  );
}

function SelectField({ id, label, value, onChange, testid, options }) {
  return (
    <div>
      <label htmlFor={id} className="cc-label block mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          data-testid={testid}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#0A0A0A] px-3.5 py-3 pr-10 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7] cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, testid }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-testid={testid}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 border border-[#0A0A0A] transition-colors ${
        checked ? "bg-[#002FA7]" : "bg-white"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-[#FF5722] transition-transform ${
          checked ? "translate-x-7" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ----------------------------- Output cells ----------------------------- */

function AreaCell({ label, value, unit, testid, muted, accent }) {
  return (
    <div
      data-testid={testid}
      className={`border p-3 ${
        accent
          ? "border-[#FF5722] bg-[#FF5722]/10"
          : muted
            ? "border-white/20"
            : "border-white/30"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
        {label}
      </p>
      <p className="font-mono text-xl mt-1.5">
        {value}
        <span className="text-white/50 text-xs ml-1">{unit}</span>
      </p>
    </div>
  );
}

function Row({ label, value, unit, testid }) {
  return (
    <li
      data-testid={testid}
      className="flex items-center justify-between gap-4 py-3"
    >
      <span className="font-mono text-sm text-white/85">{label}</span>
      <span className="font-mono text-base">
        {value}
        <span className="text-white/50 text-xs ml-1.5">{unit}</span>
      </span>
    </li>
  );
}
