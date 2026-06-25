import { ALL_MODULES } from "@/lib/modules";

export default function Marquee() {
  // Duplicate items so the marquee loops seamlessly
  const items = [...ALL_MODULES, ...ALL_MODULES];
  return (
    <div
      data-testid="hero-marquee"
      className="border-y border-[#E5E5E5] bg-[#F4F4F5] overflow-hidden"
    >
      <div className="marquee-track py-4">
        {items.map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-[#525252]"
          >
            <span className="text-[#002FA7]">◆</span>
            <span className="text-[#0A0A0A]">{m.name}</span>
            <span>· {m.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
