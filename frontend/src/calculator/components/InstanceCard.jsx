import { useMemo } from "react";
import { Plus, X, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import {
  calculate,
  validate,
  isInstanceComplete,
  qtyText,
  applyContingencyToRows,
} from "@/calculator/engine/calculate";
import { modules } from "@/calculator/engine/constants";
import FormFields from "./FormFields";

export default function InstanceCard({ instance, contingency, allInstances = [], onUpdate, onRemove }) {
  const moduleDef = modules.find((m) => m.id === instance.moduleId);
  const complete = isInstanceComplete(instance.moduleId, instance.form);
  const warnings = useMemo(
    () => (complete ? validate(instance.moduleId, instance.form) : []),
    [instance.moduleId, instance.form, complete],
  );
  const rows = useMemo(
    () => (complete ? calculate(instance.moduleId, instance.form) : []),
    [instance.moduleId, instance.form, complete],
  );
  const displayRows = useMemo(
    () => applyContingencyToRows(rows, contingency),
    [rows, contingency],
  );

  const setForm = (updater) => {
    const next = typeof updater === "function" ? updater(instance.form) : updater;
    onUpdate(instance.id, { form: next });
  };

  const groups = displayRows.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  return (
    <article
      data-testid={`instance-card-${instance.id}`}
      className="border border-[#0A0A0A] bg-white"
    >
      <header className="flex items-center justify-between gap-3 border-b border-[#0A0A0A] px-4 sm:px-6 py-3 bg-[#F4F4F5]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="cc-label !text-[10px] border border-[#0A0A0A] px-2 py-0.5 bg-white">
            {moduleDef?.label}
          </span>
          <input
            value={instance.name}
            onChange={(e) => onUpdate(instance.id, { name: e.target.value })}
            data-testid={`instance-name-${instance.id}`}
            className="bg-transparent font-display font-bold tracking-tight uppercase text-lg flex-1 min-w-0 focus:outline-none focus:bg-white focus:px-2 focus:border focus:border-[#002FA7]"
          />
          {!complete && (
            <span className="cc-label !text-[#FF5722] hidden sm:inline">
              Incomplete
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onUpdate(instance.id, { expanded: !instance.expanded })}
          className="w-8 h-8 grid place-items-center border border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          aria-label={instance.expanded ? "Collapse" : "Expand"}
          data-testid={`instance-toggle-${instance.id}`}
        >
          {instance.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => onRemove(instance.id)}
          className="w-8 h-8 grid place-items-center border border-[#0A0A0A] hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722]"
          aria-label="Remove"
          data-testid={`instance-remove-${instance.id}`}
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {instance.expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Inputs */}
          <div className="lg:col-span-6 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
            <p className="cc-label">Inputs</p>
            <div className="mt-4">
              <FormFields
                id={instance.moduleId}
                form={instance.form}
                setForm={setForm}
                allInstances={allInstances}
              />
            </div>
            {warnings.length > 0 && (
              <div className="mt-4 border border-[#FF5722] bg-[#FF5722]/5 p-3 flex gap-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-[#FF5722] shrink-0" />
                <ul className="font-mono text-xs text-[#0A0A0A] space-y-1">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Output */}
          <div
            className="lg:col-span-6 p-5 lg:p-6 bg-[#0A0A0A] text-white"
            data-testid={`instance-output-${instance.id}`}
          >
            <p className="cc-label !text-white/50">Live materials</p>
            {!complete && (
              <p className="mt-4 font-mono text-xs text-white/60">
                Fill out all required fields to see the bill of materials.
              </p>
            )}
            {complete &&
              Object.entries(groups).map(([cat, items]) => (
                <div key={cat} className="mt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF5722] mb-2">
                    {cat}
                  </p>
                  <ul className="divide-y divide-white/10 border-y border-white/15">
                    {items.map((it, i) => (
                      <li
                        key={i}
                        className="flex items-baseline justify-between gap-3 py-2"
                      >
                        <span className="font-mono text-xs text-white/85">
                          {it.item}
                        </span>
                        <span className="font-mono text-sm whitespace-nowrap">
                          {qtyText(it.quantity, it.whole)}
                          <span className="text-white/50 text-[10px] ml-1.5">
                            {it.unit}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </article>
  );
}

// re-export helper used in Workspace
export function AddRowButton({ onAdd, label }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] border border-[#0A0A0A] px-3 py-1.5 hover:bg-[#002FA7] hover:text-white hover:border-[#002FA7]"
    >
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
