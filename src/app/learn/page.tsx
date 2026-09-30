"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { accentHex, getCategoriesByDepartment, getTopicsByDepartment } from "@/lib/content";
import { PageHeader, cn } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";
import { getDepartment } from "@/lib/departments";

export default function LearnPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const { activeDepartment } = useWorkspace();
  const departmentTopics = useMemo(() => getTopicsByDepartment(activeDepartment), [activeDepartment]);
  const departmentCategories = useMemo(() => getCategoriesByDepartment(activeDepartment), [activeDepartment]);
  const department = getDepartment(activeDepartment);

  useEffect(() => {
    if (cat !== "all" && !departmentCategories.some((category) => category.id === cat)) setCat("all");
  }, [activeDepartment, cat, departmentCategories]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return departmentTopics.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (!query) return true;
      return (
        t.name.toLowerCase().includes(query) ||
        t.definition.toLowerCase().includes(query) ||
        t.communicates.toLowerCase().includes(query) ||
        (t.abbr?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [q, cat, departmentTopics]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof departmentTopics>();
    for (const t of filtered) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Field guide"
        title={`${department.name} Reference Sheets`}
        description={`Short, practical field notes selected for the ${department.name} department.`}
        accent="info"
      />

      <div className="hairline-b sticky top-14 z-30 -mx-4 bg-ink/95 px-4 py-3 shadow-xs">
        <div className="relative">
          <Icon name="book-open" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-haze-2 pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exposure, shot sizes, camera motion, depth of field…"
            className="focus-ring w-full rounded-sm border border-line-strong bg-panel pl-10 pr-4 py-2.5 text-sm text-chalk placeholder:text-haze-2"
          />
        </div>
        <div className="no-scrollbar mt-2.5 flex gap-1 overflow-x-auto pb-1">
          <CatChip active={cat === "all"} onClick={() => setCat("all")} label="All Sections" />
          {departmentCategories.map((c) => (
            <CatChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} label={c.name} color={accentHex[c.accent]} />
          ))}
        </div>
      </div>

      {grouped.size === 0 && (
        <div className="rounded-sm inset p-10 text-center space-y-2">
          <Icon name="info" size={24} className="mx-auto text-haze" />
          <p className="text-sm text-haze font-medium">No {department.name.toLowerCase()} entries match “{q}”.</p>
        </div>
      )}

      {/* Editorial ruled section layout rather than repetitive cards */}
      <div className="space-y-10">
        {[...grouped.entries()].map(([catId, list]) => {
          const c = departmentCategories.find((x) => x.id === catId)!;
          return (
            <section key={catId} className="space-y-4">
              <div className="hairline-b pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="tech rounded-sm px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--color-panel-3)", color: accentHex[c.accent] }}>
                    {c.abbr}
                  </span>
                  <h2 className="cond text-lg font-bold text-chalk">{c.name}</h2>
                </div>
                <span className="tech text-xs text-haze-2">{list.length} {list.length === 1 ? "entry" : "entries"}</span>
              </div>
              <div className="divide-y divide-line rounded-sm border border-line-strong bg-panel">
                {list.map((t, idx) => (
                  <Link
                    key={t.slug}
                    href={`/learn/${t.slug}`}
                    className="focus-ring group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-ink-2/40"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="tech text-xs text-haze-2 font-mono">#{String(idx + 1).padStart(2, "0")}</span>
                        <span className="cond text-base font-bold text-chalk group-hover:text-flare transition-colors">{t.name}</span>
                        {t.abbr && <span className="tech text-[11px] px-1.5 py-0.5 rounded-sm bg-ink-2" style={{ color: accentHex[t.accent] }}>{t.abbr}</span>}
                      </div>
                      <p className="text-xs text-haze line-clamp-2 max-w-3xl leading-relaxed">{t.definition}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-0.5" style={{ color: accentHex[t.accent] }}>
                      <span>Open Sheet</span>
                      <Icon name="arrow-right" size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CatChip({ active, onClick, label, color = "#a8362a" }: { active: boolean; onClick: () => void; label: string; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("focus-ring shrink-0 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors border")}
      style={
        active
          ? { background: color, color: "#f8f2e6", borderColor: color }
          : { color: "var(--color-haze)", background: "var(--color-panel)", borderColor: "var(--color-line)" }
      }
    >
      {label}
    </button>
  );
}
