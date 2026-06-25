import { priceCatalog } from "@/calculator/engine/prices";
import {
  canonicalMaterial,
  priceKey,
  displayMaterialName,
} from "@/calculator/engine/calculate";

export default function PriceSettings({ bom, prices, setPrices }) {
  // Merge the static catalog with any materials present in the current BOM
  const seen = new Map();
  [...priceCatalog, ...bom.map(canonicalMaterial)].forEach((it) => {
    seen.set(priceKey(it), canonicalMaterial(it));
  });
  const catalog = Array.from(seen.values()).sort((a, b) =>
    `${a.item} ${a.unit}`.localeCompare(`${b.item} ${b.unit}`),
  );

  const update = (item, v) =>
    setPrices((cur) => ({ ...cur, [priceKey(item)]: v }));

  return (
    <section data-testid="prices-panel" className="space-y-8">
      <header>
        <p className="cc-label">[ Price settings ]</p>
        <h2 className="font-display font-black tracking-tighter uppercase text-3xl sm:text-4xl mt-3">
          Your prices. <span className="text-[#002FA7]">Your BOQ.</span>
        </h2>
        <p className="mt-3 text-[#525252] max-w-2xl">
          Enter each material&apos;s unit price once. Every BOM and BOQ recalculates.
          Stored in your browser.
        </p>
      </header>

      <div className="border border-[#0A0A0A] bg-white overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead className="bg-[#0A0A0A] text-white">
            <tr>
              {["Item", "Unit", "Unit price ₱"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.18em] border-r border-white/10 last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {catalog.map((it) => (
              <tr key={priceKey(it)} className="hover:bg-[#F4F4F5]">
                <td className="px-3 py-2">{displayMaterialName(it)}</td>
                <td className="px-3 py-2 text-xs text-[#525252]">{it.unit}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min={0}
                    value={prices[priceKey(it)] ?? ""}
                    onChange={(e) => update(it, e.target.value)}
                    data-testid={`price-input-${priceKey(it)}`}
                    className="w-full border border-[#0A0A0A] px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
