"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getToolsByDepartment } from "@/lib/tools";
import { PageHeader, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";
import { getDepartment } from "@/lib/departments";

export default function ToolsPage() {
  const { activeDepartment } = useWorkspace();
  const tools = useMemo(() => getToolsByDepartment(activeDepartment), [activeDepartment]);
  const department = getDepartment(activeDepartment);
  return (
    <div className="space-y-8">
      <PageHeader
        kicker={`${department.name} tools`}
        title={`Tools for ${department.name}`}
        description={`Focused calculators, guides, and simulators for the ${department.name} department.`}
        accent="flare"
      />

      {/* Editorial notebook sheet layout instead of repetitive cards */}
      <div className="rounded-sm border border-line-strong bg-panel shadow-sm">
        <div className="hairline-b flex items-center justify-between px-5 py-3 bg-ink-2/50 text-xs font-semibold text-haze uppercase tracking-wider">
          <span>Simulator Index &amp; Purpose</span>
          <span className="hidden sm:inline">Action / Category</span>
        </div>
        <div className="divide-y divide-line">
          {tools.map((t, i) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="focus-ring group flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-ink-2/30"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line-strong bg-panel-2 text-haze transition-colors group-hover:border-flare group-hover:text-flare">
                  <Icon name={t.glyph} size={19} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="tech text-xs text-haze-2 font-semibold">No. {String(i + 1).padStart(2, "0")}</span>
                    <h2 className="cond text-lg font-bold text-chalk group-hover:text-flare transition-colors">{t.title}</h2>
                    <Tag accent={t.accent}>{t.kicker}</Tag>
                  </div>
                  <p className="text-sm leading-relaxed text-haze max-w-2xl">{t.description}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-line sm:border-0">
                <span className="tech text-[11px] uppercase tracking-wider text-haze-2 sm:block hidden">{t.category.replace("-", " ")}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-flare group-hover:translate-x-0.5 transition-transform">
                  <span>Open Tool</span>
                  <Icon name="arrow-right" size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
