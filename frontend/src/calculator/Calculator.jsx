import { useMemo, useState } from "react";
import { LayoutGrid, ListTree, Layers, Coins, Cloud, CloudOff, Loader2, CheckCircle2 } from "lucide-react";
import {
  isInstanceComplete,
  calculate,
  applyContingencyToRows,
  displayMaterialName,
} from "@/calculator/engine/calculate";
import { useAuth } from "@/auth/AuthContext";
import useSupabaseSync from "./hooks/useSupabaseSync";
import Workspace from "./components/Workspace";
import BomPanel from "./components/BomPanel";
import MaterialTotals from "./components/MaterialTotals";
import PriceSettings from "./components/PriceSettings";

const TABS = [
  { id: "workspace", label: "Workspace", icon: LayoutGrid },
  { id: "bom", label: "BOM", icon: ListTree },
  { id: "materials", label: "Materials", icon: Layers },
  { id: "prices", label: "Prices", icon: Coins },
];

function SyncBadge({ status, error }) {
  const map = {
    idle: { icon: Cloud, text: "Idle", color: "text-[#525252]" },
    loading: { icon: Loader2, text: "Loading…", color: "text-[#002FA7]", spin: true },
    saving: { icon: Loader2, text: "Saving…", color: "text-[#002FA7]", spin: true },
    saved: { icon: CheckCircle2, text: "Synced", color: "text-[#0A0A0A]" },
    error: { icon: CloudOff, text: "Sync error", color: "text-[#FF5722]" },
  };
  const s = map[status] || map.idle;
  return (
    <span
      data-testid="sync-status"
      data-status={status}
      title={error || s.text}
      className={`hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] border border-[#E5E5E5] px-2.5 py-1 ${s.color}`}
    >
      <s.icon className={`w-3.5 h-3.5 ${s.spin ? "animate-spin" : ""}`} />
      {s.text}
    </span>
  );
}

export default function Calculator({ projectId }) {
  const { user } = useAuth();
  const sync = useSupabaseSync(user?.id, projectId);
  const [tab, setTab] = useState("workspace");

  const bom = useMemo(() => {
    const out = [];
    sync.instances.forEach((inst) => {
      if (!isInstanceComplete(inst.moduleId, inst.form)) return;
      const raw = calculate(inst.moduleId, inst.form);
      const adjusted = applyContingencyToRows(raw, sync.contingency);
      adjusted.forEach((r, idx) => {
        if (r.bom === false) return;
        out.push({
          ...r,
          item: displayMaterialName(r),
          instanceId: inst.id,
          source: inst.name,
          id: `${inst.id}-${idx}`,
        });
      });
    });
    return out;
  }, [sync.instances, sync.contingency]);

  return (
    <main className="bg-white text-[#0A0A0A] min-h-screen blueprint-grid">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 lg:py-14">
        <header className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="cc-label">[ Workspace · v0.1 ]</p>
            <SyncBadge status={sync.status} error={sync.error} />
          </div>
          <h1
            data-testid="calculator-title"
            className="font-display font-black tracking-tighter uppercase mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[0.9]"
          >
            {sync.projectName || (
              <>
                New <span className="text-[#002FA7]">project.</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-[#525252] max-w-2xl">
            Add module instances, fill in dimensions, and watch the bill of
            materials roll up live. Your project syncs to your account — sign in
            from any device to pick up where you left off.
          </p>
        </header>

        {/* Tabs */}
        <nav
          data-testid="calculator-tabs"
          className="border-y border-[#0A0A0A] flex overflow-x-auto"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                data-testid={`calc-tab-${t.id}`}
                className={`shrink-0 inline-flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] border-r border-[#0A0A0A] last:border-r-0 ${
                  active
                    ? "bg-[#0A0A0A] text-white"
                    : "bg-white text-[#0A0A0A] hover:bg-[#F4F4F5]"
                }`}
              >
                <t.icon className="w-4 h-4" strokeWidth={2} />
                {t.label}
                {t.id === "bom" && bom.length > 0 && (
                  <span
                    className={`ml-1 font-mono text-[10px] px-1.5 py-0.5 ${
                      active ? "bg-[#FF5722] text-white" : "bg-[#0A0A0A] text-white"
                    }`}
                  >
                    {bom.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-10">
          {tab === "workspace" && (
            <Workspace
              instances={sync.instances}
              setInstances={sync.setInstances}
              projectName={sync.projectName}
              setProjectName={sync.setProjectName}
              contingency={sync.contingency}
              setContingency={sync.setContingency}
            />
          )}
          {tab === "bom" && (
            <BomPanel bom={bom} prices={sync.prices} contingency={sync.contingency} />
          )}
          {tab === "materials" && (
            <MaterialTotals bom={bom} prices={sync.prices} contingency={sync.contingency} />
          )}
          {tab === "prices" && (
            <PriceSettings bom={bom} prices={sync.prices} setPrices={sync.setPrices} />
          )}
        </div>
      </div>
    </main>
  );
}
