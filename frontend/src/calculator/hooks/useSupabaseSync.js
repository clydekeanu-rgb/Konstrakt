import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { defaultPrices } from "@/calculator/engine/prices";

const DEBOUNCE_MS = 700;

// Supabase-backed source of truth for a single project + user-level prices.
// Loads on mount, debounce-saves any change.
export default function useSupabaseSync(userId, projectId) {
  const [project, setProject] = useState({
    name: "",
    contingency: 0,
    instances: [],
  });
  const [prices, setPrices] = useState(defaultPrices);
  const [status, setStatus] = useState("idle"); // idle | loading | saving | saved | error
  const [error, setError] = useState(null);
  const hydrated = useRef(false);
  const projectTimer = useRef(null);
  const pricesTimer = useRef(null);

  // ---- load on user/project change ----
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    hydrated.current = false;
    setStatus("loading");
    setError(null);

    (async () => {
      try {
        // Build queries — project query only runs when we have a projectId
        const queries = [];

        if (projectId) {
          queries.push(
            supabase
              .from("conscalc_projects")
              .select("name, contingency, instances")
              .eq("id", projectId)
              .maybeSingle(),
          );
        } else {
          queries.push(Promise.resolve({ data: null, error: null }));
        }

        queries.push(
          supabase
            .from("conscalc_prices")
            .select("prices")
            .eq("user_id", userId)
            .maybeSingle(),
        );

        const [{ data: pRow, error: pErr }, { data: prRow, error: prErr }] =
          await Promise.all(queries);

        if (cancelled) return;
        if (pErr) throw pErr;
        if (prErr) throw prErr;

        const nextProject = pRow
          ? {
              name: pRow.name || "",
              contingency: Number(pRow.contingency) || 0,
              instances: Array.isArray(pRow.instances) ? pRow.instances : [],
            }
          : {
              name: "",
              contingency: 0,
              instances: [],
            };

        const nextPrices = prRow?.prices
          ? { ...defaultPrices, ...prRow.prices }
          : { ...defaultPrices };

        setProject(nextProject);
        setPrices(nextPrices);
        hydrated.current = true;

        // If no prices row existed, seed one so future upserts have a target
        if (!prRow) {
          await supabase.from("conscalc_prices").upsert(
            { user_id: userId, prices: nextPrices },
            { onConflict: "user_id" },
          );
        }
        if (!cancelled) setStatus("saved");
      } catch (e) {
        if (cancelled) return;
        console.error("Supabase sync load error:", e);
        setError(e?.message || String(e));
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, projectId]);

  // ---- debounced save: project ----
  useEffect(() => {
    if (!userId || !projectId || !hydrated.current) return;
    if (projectTimer.current) clearTimeout(projectTimer.current);
    setStatus("saving");
    projectTimer.current = setTimeout(async () => {
      try {
        const { error: err } = await supabase
          .from("conscalc_projects")
          .upsert(
            {
              id: projectId,
              user_id: userId,
              name: project.name,
              contingency: project.contingency,
              instances: project.instances,
            },
            { onConflict: "id" },
          );
        if (err) throw err;
        setStatus("saved");
      } catch (e) {
        console.error("Save project error:", e);
        setError(e?.message || String(e));
        setStatus("error");
      }
    }, DEBOUNCE_MS);
    return () => projectTimer.current && clearTimeout(projectTimer.current);
  }, [userId, projectId, project]);

  // ---- debounced save: prices ----
  useEffect(() => {
    if (!userId || !hydrated.current) return;
    if (pricesTimer.current) clearTimeout(pricesTimer.current);
    setStatus("saving");
    pricesTimer.current = setTimeout(async () => {
      try {
        const { error: err } = await supabase
          .from("conscalc_prices")
          .upsert(
            { user_id: userId, prices },
            { onConflict: "user_id" },
          );
        if (err) throw err;
        setStatus("saved");
      } catch (e) {
        console.error("Save prices error:", e);
        setError(e?.message || String(e));
        setStatus("error");
      }
    }, DEBOUNCE_MS);
    return () => pricesTimer.current && clearTimeout(pricesTimer.current);
  }, [userId, prices]);

  // ---- field setters (stable refs) ----
  const setProjectName = useCallback(
    (v) => setProject((p) => ({ ...p, name: typeof v === "function" ? v(p.name) : v })),
    [],
  );
  const setContingency = useCallback(
    (v) =>
      setProject((p) => {
        const next = typeof v === "function" ? v(p.contingency) : v;
        return { ...p, contingency: Number(next) || 0 };
      }),
    [],
  );
  const setInstances = useCallback(
    (v) =>
      setProject((p) => ({
        ...p,
        instances: typeof v === "function" ? v(p.instances) : v,
      })),
    [],
  );

  return {
    projectName: project.name,
    contingency: project.contingency,
    instances: project.instances,
    prices,
    setProjectName,
    setContingency,
    setInstances,
    setPrices,
    status,
    error,
    hydrated: hydrated.current,
  };
}
