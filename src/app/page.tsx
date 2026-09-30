"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDeptHomeConfig } from "@/lib/department-home";
import { getCategoriesByDepartment } from "@/lib/content";
import { getDepartment } from "@/lib/departments";
import { PageHeader, Panel, Tag, MarginNote, cn } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";

export default function HomePage() {
  const { activeDepartment, user } = useWorkspace();
  const deptDef = getDepartment(activeDepartment);
  const homeConfig = getDeptHomeConfig(activeDepartment);
  const deptCategories = getCategoriesByDepartment(activeDepartment);

  const [activeScenarioId, setActiveScenarioId] = useState(homeConfig.scenarios[0]?.id || "");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [latestProject, setLatestProject] = useState<any>(null);

  useEffect(() => {
    if (homeConfig.scenarios.length > 0 && !homeConfig.scenarios.find((s) => s.id === activeScenarioId)) {
      setActiveScenarioId(homeConfig.scenarios[0].id);
    }
  }, [activeDepartment, homeConfig.scenarios, activeScenarioId]);

  useEffect(() => {
    async function fetchLatestProject() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setLatestProject(data.items[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load latest project for home:", err);
      }
    }
    fetchLatestProject();
  }, [activeDepartment]);

  const scenario = homeConfig.scenarios.find((s) => s.id === activeScenarioId) || homeConfig.scenarios[0];
  const activeIdx = homeConfig.scenarios.findIndex((s) => s.id === (scenario?.id || ""));

  function toggleCheck(item: string) {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  return (
    <div className="space-y-8">
      {/* Notebook cover */}
      <section className="fadeup panel relative overflow-hidden rounded-sm p-6 sm:p-8">
        <div className="absolute right-5 top-5 hidden sm:block">
          <span className="tape inline-block px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-chalk/70">
            {deptDef.shortName} Vol. 1
          </span>
        </div>
        <div className="label-tag flex items-center gap-1.5" style={{ color: deptDef.color }}>
          <Icon name={deptDef.icon} size={15} />
          <span>{deptDef.name} Department Workspace</span>
        </div>
        <h1 className="cond mt-2 text-4xl font-bold leading-[1.02] tracking-tight text-chalk sm:text-5xl">
          {deptDef.documentTitle}
        </h1>
        <p className="hand mt-1.5 text-xl text-haze">{deptDef.name} Field Notes &amp; Production Binders</p>
        <div className="mt-4 h-px w-28" style={{ background: deptDef.color }} />
        <p className="mt-4 max-w-xl text-sm text-haze leading-relaxed">
          {deptDef.blurb} Everything on your dashboard, reference sheets, interactive calculators, and shot logs is now strictly tailored to the <strong>{deptDef.name}</strong> department.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {homeConfig.quickActions.map((qa, i) => (
            <Link
              key={qa.href}
              href={qa.href}
              className={cn(
                "focus-ring inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors shadow-xs",
                qa.primary ? "bg-flare text-panel hover:bg-flare-2" : "border border-line-strong bg-panel-2 text-chalk hover:bg-ink-2"
              )}
            >
              <Icon name={qa.icon} size={18} />
              <span>{qa.label}</span>
            </Link>
          ))}
          <Link href="/projects" className="focus-ring inline-flex items-center gap-2 rounded-sm border border-line-strong bg-transparent px-4 py-2.5 text-sm font-semibold text-chalk transition-colors hover:bg-ink-2/40">
            <Icon name="projects" size={18} />
            <span>Open Production Projects</span>
          </Link>
        </div>
      </section>

      {/* Active Project Card */}
      {latestProject && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="label-tag text-info flex items-center gap-1.5">
              <Icon name="projects" size={14} />
              <span>ACTIVE PRODUCTION ASSIGNMENT</span>
            </div>
            <Link href={`/projects/${latestProject.id}`} className="tech text-xs font-bold text-flare hover:underline flex items-center gap-1">
              <span>View All Project Binders</span>
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>
          <div className="rounded-sm border-2 border-chalk bg-panel p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Tag accent="flare" filled>{latestProject.status.toUpperCase()}</Tag>
                <span className="cond text-xl font-bold text-chalk">{latestProject.title}</span>
              </div>
              <p className="text-xs text-haze max-w-2xl">{latestProject.description}</p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/projects/${latestProject.id}`}
                className="focus-ring inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 text-xs font-bold text-panel hover:bg-ink/90 transition-colors shadow-xs"
              >
                <Icon name={deptDef.icon} size={15} />
                <span>Open {deptDef.shortName} Project Binder</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Department Checklist */}
      <section className="space-y-4">
        <PageHeader
          kicker="Section 01 · Set Operations"
          title={homeConfig.checklist.title}
          description="Interactive field protocol checklist. Check off tasks as you complete morning rigging, rehearsal blocks, and camera wrap."
          accent="amber"
          pageNo="p. 01"
        />

        <div className="rounded-sm border border-line-strong bg-panel p-5 shadow-xs space-y-3">
          <div className="divide-y divide-line">
            {homeConfig.checklist.items.map((item, idx) => {
              const isChecked = Boolean(checkedItems[item]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCheck(item)}
                  className={cn(
                    "focus-ring flex w-full items-start gap-3 py-3 text-left transition-colors",
                    isChecked ? "text-haze line-through" : "text-chalk font-medium"
                  )}
                >
                  <span className="chk mt-0.5 shrink-0" style={{ borderColor: isChecked ? "var(--color-ok)" : undefined, background: isChecked ? "var(--color-ok)" : "transparent" }}>
                    {isChecked && <Icon name="check" size={13} className="text-[#f8f2e6]" />}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2 text-xs text-haze">
            <span>{Object.values(checkedItems).filter(Boolean).length} of {homeConfig.checklist.items.length} tasks verified</span>
            {Object.values(checkedItems).filter(Boolean).length > 0 && (
              <button type="button" onClick={() => setCheckedItems({})} className="text-xs text-flare hover:underline font-semibold">
                Reset checklist
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick start Scenarios */}
      {scenario && (
        <section className="space-y-4">
          <PageHeader
            kicker="Section 02 · Department Scenarios"
            title={`${deptDef.name} Field Setups & Protocol`}
            description={`Practical starting parameters for common ${deptDef.name.toLowerCase()} production situations. Select a setup below.`}
            accent="flare"
            pageNo="p. 02"
          />

          <div className="divide-y divide-line rounded-sm border border-line-strong bg-panel">
            {homeConfig.scenarios.map((s, i) => {
              const on = s.id === scenario.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveScenarioId(s.id)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors",
                    on ? "bg-ink-2" : "hover:bg-ink-2/60"
                  )}
                >
                  <span className="tech w-6 shrink-0 text-sm font-semibold" style={{ color: on ? "var(--color-flare)" : "var(--color-haze-2)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon name={s.icon} size={20} className={cn("shrink-0", on ? "text-flare" : "text-haze")} />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-sm font-semibold", on ? "text-flare" : "text-chalk")}>{s.title}</span>
                    <span className="block truncate text-xs text-haze">{s.intro}</span>
                  </span>
                  {on && <Icon name="arrow-right" size={18} className="shrink-0 text-flare" />}
                </button>
              );
            })}
          </div>

          <Panel
            label={`${deptDef.name.toUpperCase()} STARTING PARAMETERS`}
            title={scenario.title}
            accent="flare"
            pageNo={`setup ${String(activeIdx + 1).padStart(2, "0")}`}
          >
            <p className="text-sm text-haze">{scenario.intro}</p>

            <table className="mt-4 w-full border-collapse text-sm">
              <tbody>
                {scenario.startingPoint.map((sp, i) => (
                  <tr key={sp.label} className={i % 2 === 0 ? "" : "bg-ink-2/50"}>
                    <td className="label-tag whitespace-nowrap border-y border-line px-3 py-2.5 align-top">{sp.label}</td>
                    <td className="tech border-y border-line px-3 py-2.5 font-semibold text-chalk">{sp.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <div className="label-tag mb-2.5">Field notes</div>
                <ul className="space-y-2">
                  {scenario.tips.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-xs text-haze leading-relaxed">
                      <Icon name="check" size={15} className="shrink-0 text-ok mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label-tag mb-2.5">Relevant tools</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.tools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-info/50 bg-info/5 px-3 py-1.5 text-xs font-semibold text-info transition-colors hover:bg-info/10"
                    >
                      <span>{t.label}</span>
                      <Icon name="arrow-right" size={13} />
                    </Link>
                  ))}
                </div>
                <div className="mt-3">
                  <MarginNote kicker="Remember this">
                    These parameters represent baseline industry starting points. Adjust dynamically on set once you test your actual location environment.
                  </MarginNote>
                </div>
              </div>
            </div>
          </Panel>
        </section>
      )}

      {/* Category shortcuts */}
      <section className="space-y-4">
        <PageHeader kicker="Section 03 · Index" title={`${deptDef.name} Reference Sections`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {deptCategories.map((c, i) => (
            <Link
              key={c.id}
              href={c.tool ?? `/learn?cat=${c.id}`}
              className="focus-ring group rounded-sm border border-line-strong bg-panel p-4 transition-colors hover:bg-ink-2/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="tech text-[10px] text-haze-2">{String(i + 1).padStart(2, "0")}</span>
                  <Tag accent={c.accent}>{c.abbr}</Tag>
                </div>
                <div className="cond mt-2 text-base font-bold text-chalk group-hover:text-flare transition-colors">{c.name}</div>
                <div className="mt-1 text-xs text-haze leading-normal">{c.blurb}</div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-flare">
                <span>Open Section</span>
                <Icon name="arrow-right" size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
