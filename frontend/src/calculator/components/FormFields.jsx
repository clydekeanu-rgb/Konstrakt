import { ChevronDown, Plus, X } from "lucide-react";
import {
  mixClasses,
  tileRates,
  scaffoldingFactors,
  suspendedSlabRates,
  OPENING_TYPES,
  woodPaintCoverage,
} from "@/calculator/engine/constants";
import { makeId } from "@/calculator/engine/calculate";

const inputCls =
  "w-full bg-white border border-[#0A0A0A] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]";

function Field({ label, children }) {
  return (
    <div>
      <label className="cc-label block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Num({ label, value, onChange, step = "any", min = 0 }) {
  return (
    <Field label={label}>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} appearance-none pr-9 cursor-pointer`}
        >
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ),
          )}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525252]" />
      </div>
    </Field>
  );
}

function MixSelect({ value, onChange }) {
  const opts = Object.keys(mixClasses).map((k) => ({
    value: k,
    label: `${k} (${mixClasses[k].ratio})`,
  }));
  return <Sel label="Mix class" value={value} onChange={onChange} options={opts} />;
}

function Toggle({ label, value, onChange }) {
  return (
    <Field label={label}>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-full border border-[#0A0A0A] px-3 py-2 font-mono text-sm text-left ${value ? "bg-[#002FA7] text-white" : "bg-white text-[#0A0A0A]"}`}
      >
        {value ? "On" : "Off"}
      </button>
    </Field>
  );
}

const BAR_DIAMS = ["10mm", "12mm", "16mm", "20mm"];

export default function FormFields({ id, form, setForm }) {
  const set = (k, v) => setForm((c) => ({ ...c, [k]: v }));

  if (id === "wall") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Num label="Length (m)" value={form.length} onChange={(v) => set("length", v)} />
          <Num label="Height (m)" value={form.height} onChange={(v) => set("height", v)} />
          <Sel label="CHB size" value={form.chb} onChange={(v) => set("chb", v)} options={[{ value: "4", label: '4"' }, { value: "6", label: '6"' }]} />
          <Sel label="Vertical spacing (cm)" value={form.vSpacing} onChange={(v) => set("vSpacing", v)} options={["40", "60", "80"]} />
          <Sel label="Horizontal layers" value={form.hLayers} onChange={(v) => set("hLayers", v)} options={["2", "3", "4"]} />
          <Sel label="Vertical bar dia." value={form.vDiameter} onChange={(v) => set("vDiameter", v)} options={BAR_DIAMS} />
          <Sel label="Horizontal bar dia." value={form.hDiameter} onChange={(v) => set("hDiameter", v)} options={BAR_DIAMS} />
          <Toggle label="Plaster" value={form.plaster} onChange={(v) => set("plaster", v)} />
          {form.plaster && (
            <Sel label="Faces" value={String(form.faces)} onChange={(v) => set("faces", v)} options={["1", "2"]} />
          )}
        </div>
        {/* Openings */}
        <div className="pt-3 border-t border-dashed border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <p className="cc-label">Openings</p>
            <button
              type="button"
              onClick={() =>
                set("openings", [
                  ...(form.openings || []),
                  { id: makeId(), type: "Main Door", width: 1, height: 2.1, count: 1 },
                ])
              }
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] border border-[#0A0A0A] px-2 py-1 hover:bg-[#002FA7] hover:text-white hover:border-[#002FA7]"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {(form.openings || []).map((o, i) => {
              const upd = (patch) =>
                set(
                  "openings",
                  form.openings.map((x, j) => (i === j ? { ...x, ...patch } : x)),
                );
              return (
                <div key={o.id || i} className="grid grid-cols-12 gap-2 items-center">
                  <select
                    value={o.type}
                    onChange={(e) => upd({ type: e.target.value })}
                    className={`${inputCls} col-span-4 text-xs`}
                  >
                    {OPENING_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input type="number" step="any" placeholder="W" value={o.width} onChange={(e) => upd({ width: e.target.value })} className={`${inputCls} col-span-2 text-xs`} />
                  <input type="number" step="any" placeholder="H" value={o.height} onChange={(e) => upd({ height: e.target.value })} className={`${inputCls} col-span-2 text-xs`} />
                  <input type="number" step="1" placeholder="×" value={o.count || 1} onChange={(e) => upd({ count: e.target.value })} className={`${inputCls} col-span-3 text-xs`} />
                  <button
                    type="button"
                    onClick={() => set("openings", form.openings.filter((_, j) => j !== i))}
                    className="col-span-1 w-full h-full grid place-items-center border border-[#0A0A0A] hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722]"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (id === "paintConcrete") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Num label="Area (sqm)" value={form.area} onChange={(v) => set("area", v)} />
        <Sel
          label="Surface"
          value={form.surface}
          onChange={(v) => {
            setForm((c) => ({ ...c, surface: v, coverage: v === "Exterior" ? 30 : 35 }));
          }}
          options={["Exterior", "Interior"]}
        />
        <Num label="Coverage (sqm/gal)" value={form.coverage} onChange={(v) => set("coverage", v)} />
        <Num label="Coats" value={form.coats} onChange={(v) => set("coats", v)} step={1} />
      </div>
    );
  }

  if (id === "paintWood") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Num label="Area (sqm)" value={form.area} onChange={(v) => set("area", v)} />
        <Sel
          label="Paint type"
          value={form.type}
          onChange={(v) => setForm((c) => ({ ...c, type: v, coverage: woodPaintCoverage[v] }))}
          options={Object.keys(woodPaintCoverage)}
        />
        <Num label="Coverage (sqm/gal)" value={form.coverage} onChange={(v) => set("coverage", v)} />
        <Num label="Coats" value={form.coats} onChange={(v) => set("coats", v)} step={1} />
      </div>
    );
  }

  const fieldSets = {
    footing: [
      ["Width (m)", "width"], ["Length (m)", "length"], ["Thickness (m)", "thickness"], ["No. of Footings", "count"],
      ["Bars per length", "barsL"], ["Bars per width", "barsW"], ["Clear cover (m)", "cover"],
      ["Bar diameter", "barDiameter", BAR_DIAMS],
    ],
    column: [
      ["Height (m)", "height"], ["Dim A / W1 (m)", "w1"], ["Dim B / W2 (m)", "w2"], ["No. of columns", "count"],
      ["No. vertical bars", "verticalBars"], ["Bar diameter", "barDiameter", BAR_DIAMS],
      ["Stirrup diameter", "stirrupDiameter", BAR_DIAMS], ["Stirrup spacing (m)", "stirrupSpacing"],
    ],
    beam: [
      ["Length (m)", "length"], ["Width / B (m)", "b"], ["Depth / D (m)", "d"], ["No. of beams", "count"],
      ["Top bars", "topBars"], ["Top bar dia.", "topDiameter", BAR_DIAMS],
      ["Bottom bars", "bottomBars"], ["Bottom bar dia.", "bottomDiameter", BAR_DIAMS],
      ["Web bars", "webBars"], ["Web bar dia.", "webDiameter", BAR_DIAMS],
      ["Stirrup dia.", "stirrupDiameter", BAR_DIAMS], ["Stirrup spacing (m)", "stirrupSpacing"],
    ],
    slab: [
      ["Length (m)", "length"], ["Width (m)", "width"], ["Thickness (m)", "thickness"],
      ["Spacing L (m)", "spacingL"], ["Bar L dia.", "diaL", BAR_DIAMS],
      ["Spacing W (m)", "spacingW"], ["Bar W dia.", "diaW", BAR_DIAMS],
    ],
    suspendedOneWay: [
      ["Length (m)", "length"], ["Width (m)", "width"], ["Thickness (m)", "thickness"],
      ["Bar spacing (cm)", "spacing", Object.keys(suspendedSlabRates.oneWay)],
      ["Bar diameter", "barDiameter", BAR_DIAMS],
    ],
    suspendedTwoWay: [
      ["Length (m)", "length"], ["Width (m)", "width"], ["Thickness (m)", "thickness"],
      ["Bar spacing (cm)", "spacing", Object.keys(suspendedSlabRates.twoWay)],
      ["Bar diameter", "barDiameter", BAR_DIAMS],
    ],
    tiling: [["Area (sqm)", "area"], ["Tile size", "tileSize", Object.keys(tileRates)], ["Breakage (%)", "breakage"]],
    ceiling: [["Length (m)", "length"], ["Width (m)", "width"]],
    drywall: [["Area (sqm)", "area"], ["Perimeter (lm)", "perimeter"]],
    roofing: [
      ["Span (m)", "span"], ["Height (m)", "height"], ["Projection (m)", "projection"], ["Roof width (m)", "width"],
      ["Sheet length (ft)", "sheetLength"], ["Side lap", "sideLap", ["2.5", "1.5"]], ["Sides", "sides", ["1", "2"]],
    ],
    scaffolding: [
      ["Column height (m)", "colHeight"], ["No. of columns", "columns"], ["Beam length (m)", "beamLength"], ["No. of beams", "beams"],
      ["Floor area (sqm)", "floorArea"], ["Lumber", "lumber", Object.keys(scaffoldingFactors)],
    ],
    riprap: [["Height (m)", "height"], ["W1 (m)", "w1"], ["W2 (m)", "w2"], ["Length (m)", "length"]],
    stairs: [
      ["Riser (m)", "riser"], ["Tread (m)", "tread"], ["Width (m)", "width"], ["No. of steps", "steps"],
      ["Stringer thickness (m)", "stringerThickness"], ["Bar spacing (m)", "barSpacing"], ["Bar dia.", "barDiameter", BAR_DIAMS],
    ],
  };

  const fields = fieldSets[id] || [];
  const showMix = ["footing", "column", "beam", "slab", "suspendedOneWay", "suspendedTwoWay", "stairs"].includes(id);

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(([label, key, options]) =>
        options ? (
          <Sel key={key} label={label} value={form[key]} onChange={(v) => set(key, v)} options={options} />
        ) : (
          <Num key={key} label={label} value={form[key]} onChange={(v) => set(key, v)} />
        ),
      )}
      {showMix && (
        <div className="col-span-2">
          <MixSelect value={form.mix} onChange={(v) => set("mix", v)} />
        </div>
      )}
    </div>
  );
}
