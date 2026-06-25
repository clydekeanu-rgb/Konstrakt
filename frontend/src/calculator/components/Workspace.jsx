import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { modules } from "@/calculator/engine/constants";
import { cloneDefaultForm, makeId } from "@/calculator/engine/calculate";
import InstanceCard from "./InstanceCard";

const createInstance = (moduleId, allInstances) => {
  const m = modules.find((x) => x.id === moduleId);
  const n = allInstances.filter((i) => i.moduleId === moduleId).length + 1;
  return {
    id: makeId(),
    moduleId,
    name: `${m.label} ${n}`,
    form: cloneDefaultForm(moduleId),
    expanded: true,
  };
};

export default function Workspace({
  instances,
  setInstances,
  projectName,
  setProjectName,
  contingency,
  setContingency,
}) {
  const update = (id, patch) =>
    setInstances((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id) => setInstances((cur) => cur.filter((it) => it.id !== id));
  const add = (moduleId) =>
    setInstances((cur) => [...cur, createInstance(moduleId, cur)]);
  const clearAll = () => {
    if (window.confirm("Remove all instances from this project?")) setInstances([]);
  };

  // Group modules by groupLabel and align instances to them
  const groups = useMemo(() => {
    const out = new Map();
    modules.forEach((m) => {
      if (!out.has(m.groupLabel)) out.set(m.groupLabel, { modules: [], items: [] });
      out.get(m.groupLabel).modules.push(m);
    });
    instances.forEach((inst) => {
      const m = modules.find((x) => x.id === inst.moduleId);
      if (m) out.get(m.groupLabel).items.push(inst);
    });
    return out;
  }, [instances]);

  return (
    <section data-testid="workspace-panel" className="space-y-8">
      {/* Project bar */}
      <div className="border border-[#0A0A0A] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 p-5 border-b md:border-b-0 md:border-r border-[#E5E5E5]">
            <label className="cc-label block mb-1.5">Project name</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              data-testid="workspace-project-name"
              placeholder="e.g. Reyes Residence — Two Storey"
              className="w-full bg-transparent font-display font-bold tracking-tight uppercase text-xl focus:outline-none"
            />
          </div>
          <div className="md:col-span-3 p-5 border-b md:border-b-0 md:border-r border-[#E5E5E5]">
            <label className="cc-label block mb-1.5">Contingency</label>
            <div className="flex items-baseline gap-2">
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={contingency}
                onChange={(e) => setContingency(e.target.value)}
                data-testid="workspace-contingency"
                className="w-24 border border-[#0A0A0A] px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#002FA7]"
              />
              <span className="font-mono text-sm text-[#525252]">%</span>
            </div>
          </div>
          <div className="md:col-span-2 p-5 flex items-end justify-end">
            <button
              type="button"
              onClick={clearAll}
              disabled={instances.length === 0}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] border border-[#0A0A0A] px-3 py-2 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0A0A0A] disabled:hover:border-[#0A0A0A]"
              data-testid="workspace-clear-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Module palette */}
      <div className="border border-[#0A0A0A] bg-[#F4F4F5]">
        <div className="px-5 py-3 border-b border-[#0A0A0A] bg-[#0A0A0A] text-white">
          <p className="cc-label !text-white/60">[ Add a module ]</p>
        </div>
        <div className="p-5 flex flex-wrap gap-2">
          {modules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => add(m.id)}
              data-testid={`add-module-${m.id}`}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] border border-[#0A0A0A] bg-white px-3 py-2 hover:bg-[#002FA7] hover:text-white hover:border-[#002FA7]"
            >
              <Plus className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Instance groups */}
      {instances.length === 0 ? (
        <div className="border border-dashed border-[#0A0A0A] p-12 text-center bg-white">
          <p className="cc-label">[ Empty workspace ]</p>
          <p className="font-display font-bold uppercase text-2xl mt-3 tracking-tight">
            Add your first module above.
          </p>
          <p className="mt-3 text-[#525252] max-w-md mx-auto">
            Each module is a self-contained calculator. Add several walls,
            footings or slabs — they all roll up into one BOM.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(groups.entries())
            .filter(([, g]) => g.items.length > 0)
            .map(([groupLabel, g]) => (
              <section key={groupLabel}>
                <header className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display font-black tracking-tighter uppercase text-2xl">
                      {groupLabel}
                    </h3>
                    <span className="cc-label">
                      {g.items.length}{" "}
                      {g.items.length === 1 ? "instance" : "instances"}
                    </span>
                  </div>
                </header>
                <div className="space-y-4">
                  {g.items.map((inst) => (
                    <InstanceCard
                      key={inst.id}
                      instance={inst}
                      allInstances={instances}
                      contingency={contingency}
                      onUpdate={update}
                      onRemove={remove}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </section>
  );
}
