import {
  num,
  money,
  qtyText,
  priceKey,
  canonicalMaterial,
  displayMaterialName,
  withContingency,
} from "@/calculator/engine/calculate";

export default function MaterialTotals({ bom, prices, contingency = 0 }) {
  const totals = Array.from(
    bom
      .reduce((map, item) => {
        const k = priceKey(item);
        const m = canonicalMaterial(item);
        const cur = map.get(k) || {
          item: m.item,
          unit: m.unit,
          quantity: 0,
          whole: item.whole,
        };
        cur.quantity += num(item.quantity);
        cur.whole = cur.whole && item.whole;
        map.set(k, cur);
        return map;
      }, new Map())
      .values(),
  ).sort((a, b) => `${a.item} ${a.unit}`.localeCompare(`${b.item} ${b.unit}`));

  const grand = totals.reduce(
    (s, it) =>
      s +
      withContingency(it.quantity, it.whole, contingency) *
        num(prices[priceKey(it)]),
    0,
  );

  if (totals.length === 0) {
    return (
      <div data-testid="materials-empty" className="border border-[#0A0A0A] p-10 bg-white">
        <p className="cc-label">[ Material totals ]</p>
        <p className="font-display font-bold uppercase text-2xl mt-3 tracking-tight">
          No materials yet.
        </p>
      </div>
    );
  }

  return (
    <section data-testid="materials-panel" className="space-y-8">
      <header>
        <p className="cc-label">[ Material totals ]</p>
        <h2 className="font-display font-black tracking-tighter uppercase text-3xl sm:text-4xl mt-3">
          One row per material.
        </h2>
      </header>

      <div className="border border-[#0A0A0A] bg-white overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead className="bg-[#0A0A0A] text-white">
            <tr>
              {["Item", "Total Qty", "Unit", "Unit ₱", "Total ₱"].map((h) => (
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
            {totals.map((it, i) => {
              const qty = withContingency(it.quantity, it.whole, contingency);
              const unit = prices[priceKey(it)];
              return (
                <tr key={i} className="hover:bg-[#F4F4F5]">
                  <td className="px-3 py-2">{displayMaterialName(it)}</td>
                  <td className="px-3 py-2 text-right">{qtyText(qty, it.whole)}</td>
                  <td className="px-3 py-2 text-xs text-[#525252]">{it.unit}</td>
                  <td className="px-3 py-2 text-right">
                    {unit ? money(unit) : <span className="text-[#FF5722]">—</span>}
                  </td>
                  <td className="px-3 py-2 text-right">{money(qty * num(unit))}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#0A0A0A] text-white">
              <td colSpan={4} className="px-3 py-3 text-right font-mono text-xs uppercase tracking-[0.18em]">
                Grand total
              </td>
              <td
                data-testid="materials-grand-total"
                className="px-3 py-3 text-right font-mono text-lg"
              >
                ₱ {money(grand)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
