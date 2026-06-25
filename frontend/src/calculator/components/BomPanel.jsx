import {
  qtyText,
  money,
  num,
  withContingency,
  priceKey,
  displayMaterialName,
} from "@/calculator/engine/calculate";

export default function BomPanel({ bom, prices, contingency = 0 }) {
  const totals = bom.reduce(
    (acc, item) => {
      const unit = prices[priceKey(item)] || 0;
      const qty = withContingency(item.quantity, item.whole, contingency);
      const t = qty * num(unit);
      acc.grand += t;
      acc.sources[item.source] = (acc.sources[item.source] || 0) + t;
      return acc;
    },
    { grand: 0, sources: {} },
  );

  if (bom.length === 0) {
    return (
      <div data-testid="bom-empty" className="border border-[#0A0A0A] p-10 bg-white">
        <p className="cc-label">[ Master BOM ]</p>
        <p className="font-display font-bold uppercase text-2xl mt-3 tracking-tight">
          No materials yet.
        </p>
        <p className="mt-3 text-[#525252] max-w-md">
          Add a module instance from the Workspace tab. Quantities will roll up
          here automatically.
        </p>
      </div>
    );
  }

  return (
    <section data-testid="bom-panel" className="space-y-8">
      <header>
        <p className="cc-label">[ Master Bill of Materials ]</p>
        <h2 className="font-display font-black tracking-tighter uppercase text-3xl sm:text-4xl mt-3">
          Every item. Every source.
        </h2>
        {num(contingency) > 0 && (
          <p className="font-mono text-xs text-[#525252] mt-2">
            Quantities include {num(contingency)}% contingency.
          </p>
        )}
      </header>

      <div className="border border-[#0A0A0A] bg-white overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead className="bg-[#0A0A0A] text-white">
            <tr>
              {["Source", "Item", "Qty", "Unit", "Unit ₱", "Total ₱"].map((h) => (
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
            {bom.map((item, i) => {
              const qty = withContingency(item.quantity, item.whole, contingency);
              const unit = prices[priceKey(item)];
              return (
                <tr
                  key={i}
                  data-testid={`bom-row-${i}`}
                  className="hover:bg-[#F4F4F5]"
                >
                  <td className="px-3 py-2 text-xs text-[#525252]">{item.source}</td>
                  <td className="px-3 py-2">{displayMaterialName(item)}</td>
                  <td className="px-3 py-2 text-right">{qtyText(qty, item.whole)}</td>
                  <td className="px-3 py-2 text-xs text-[#525252]">{item.unit}</td>
                  <td className="px-3 py-2 text-right">
                    {unit ? money(unit) : <span className="text-[#FF5722]">—</span>}
                  </td>
                  <td className="px-3 py-2 text-right">{money(qty * num(unit))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subtotals + grand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#0A0A0A] bg-white">
        <div className="lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
          <p className="cc-label">Subtotals by source</p>
          <ul className="mt-4 divide-y divide-[#E5E5E5]">
            {Object.entries(totals.sources).map(([src, t]) => (
              <li key={src} className="flex items-baseline justify-between py-2">
                <span className="font-mono text-sm">{src}</span>
                <span className="font-mono text-sm">₱ {money(t)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4 p-6 bg-[#0A0A0A] text-white">
          <p className="cc-label !text-white/50">Grand total</p>
          <p
            data-testid="bom-grand-total"
            className="font-display font-black tracking-tighter text-4xl lg:text-5xl mt-3"
          >
            ₱ {money(totals.grand)}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 mt-3">
            Items without a unit price are excluded.
          </p>
        </div>
      </div>
    </section>
  );
}
