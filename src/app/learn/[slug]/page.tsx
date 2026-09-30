import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { favourites } from "@/db/schema";
import { findTopic, categoryById, topicsByCategory, accentHex } from "@/lib/content";
import { Tag } from "@/components/ui";
import { FavouriteToggle } from "@/components/FavouriteToggle";
import { Icon } from "@/components/Icon";
import { DepartmentAccessBoundary } from "@/components/DepartmentAccessBoundary";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const t = findTopic(p.slug);
    return { title: t ? `${t.name} — FrameLab` : "FrameLab" };
  });
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const rows = await db.select({ slug: favourites.slug }).from(favourites);
  const saved = new Set(rows.map((r) => r.slug));
  const cat = categoryById(topic.category)!;
  const siblings = topicsByCategory(topic.category);
  const idx = siblings.findIndex((t) => t.slug === slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];
  const hex = accentHex[topic.accent];

  const fields: { label: string; value: string; accent: "flare" | "info" | "ok" | "amber" | "rec" }[] = [
    { label: "What it communicates", value: topic.communicates, accent: "flare" },
    { label: "When to use it", value: topic.whenToUse, accent: "ok" },
    { label: "How to achieve it", value: topic.howToAchieve, accent: "info" },
    { label: "Equipment required", value: topic.equipment, accent: "amber" },
    { label: "Common mistake", value: topic.commonMistake, accent: "rec" },
  ];

  return (
    <DepartmentAccessBoundary kind="topic" slug={slug}>
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-haze">
        <Link href="/learn" className="hover:text-chalk">Learn</Link>
        <span>/</span>
        <Link href={`/learn?cat=${cat.id}`} className="hover:text-chalk" style={{ color: hex }}>{cat.name}</Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-chalk">{topic.name}</h1>
            {topic.abbr && (
              <span className="tech rounded-sm border px-2 py-0.5 text-xs font-bold" style={{ color: hex, borderColor: hex + "55" }}>
                {topic.abbr}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-haze">{topic.definition}</p>
        </div>
        <FavouriteToggle slug={topic.slug} title={topic.name} category={cat.name} accent={topic.accent} initialSaved={saved.has(topic.slug)} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-sm border border-line bg-panel">
            <div className="relative flex items-center gap-4 p-5">
              <TopicVisual category={topic.category} hex={hex} />
              <div>
                <div className="label-tag" style={{ color: hex }}>ANIMATED VISUAL</div>
                <p className="text-sm text-chalk">See this concept in motion.</p>
                {topic.tool && (
                  <Link href={topic.tool} className="mt-2.5 inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-bold text-[#f8f2e6] transition-opacity hover:opacity-90 shadow-xs" style={{ background: hex }}>
                    <Icon name="sliders" size={15} />
                    <span>Open Interactive Simulator</span>
                    <Icon name="arrow-right" size={14} />
                  </Link>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label} className="rounded-sm border border-line-strong bg-panel p-4 shadow-xs">
                <div className="label-tag" style={{ color: accentHex[f.accent] }}>{f.label}</div>
                <p className="mt-1.5 text-sm text-chalk leading-relaxed">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          {topic.compareWith && (
            <div className="rounded-sm border border-line-strong bg-panel p-4 shadow-xs">
              <div className="label-tag text-info flex items-center gap-1.5">
                <Icon name="info" size={14} className="text-info" />
                <span>COMPARE WITH</span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-chalk">{topic.compareWith}</p>
            </div>
          )}
          <div className="rounded-sm border border-line-strong bg-panel p-4 shadow-xs">
            <div className="label-tag text-flare flex items-center gap-1.5">
              <Icon name="bookmark" size={14} className="text-flare" />
              <span>NOTEBOOK REFERENCE</span>
            </div>
            <p className="mt-1.5 text-xs text-haze leading-relaxed">
              Bookmark this sheet in your Saved notebook for quick on-set field access. Fully accessible offline when running as an installable app.
            </p>
          </div>
        </aside>
      </div>

      <nav className="flex items-center justify-between gap-3 border-t border-line pt-5">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="focus-ring inline-flex items-center gap-2 rounded-sm border border-line-strong px-3.5 py-2 text-xs font-semibold text-haze transition-colors hover:text-chalk hover:bg-ink-2">
            <Icon name="arrow-left" size={15} />
            <span>{prev.name}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="focus-ring inline-flex items-center gap-2 rounded-sm border border-line-strong px-3.5 py-2 text-xs font-semibold text-haze transition-colors hover:text-chalk hover:bg-ink-2">
            <span>{next.name}</span>
            <Icon name="arrow-right" size={15} />
          </Link>
        ) : <span />}
      </nav>
    </div>
    </DepartmentAccessBoundary>
  );
}

function TopicVisual({ category, hex }: { category: string; hex: string }) {
  if (category === "camera-movement") {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64">
        <path d="M8 50 Q32 8 56 50" fill="none" stroke={hex} strokeWidth="2" strokeDasharray="3 3" className="dash-flow" />
        <circle cx="56" cy="50" r="4" fill={hex} />
        <circle cx="32" cy="34" r="3" fill="#375c7d" />
      </svg>
    );
  }
  if (category === "composition") {
    return (
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" stroke={hex} strokeWidth="1.2">
        <rect x="2" y="2" width="60" height="44" rx="2" />
        <line x1="22.3" y1="2" x2="22.3" y2="46" strokeOpacity="0.6" />
        <line x1="41.6" y1="2" x2="41.6" y2="46" strokeOpacity="0.6" />
        <line x1="2" y1="17.3" x2="62" y2="17.3" strokeOpacity="0.6" />
        <line x1="2" y1="30.6" x2="62" y2="30.6" strokeOpacity="0.6" />
        <circle cx="41.6" cy="17.3" r="3" fill={hex} stroke="none" />
      </svg>
    );
  }
  if (category === "shot-sizes" || category === "camera-angles") {
    return (
      <svg width="56" height="64" viewBox="0 0 56 64">
        <circle cx="28" cy="20" r="10" fill={hex} fillOpacity="0.25" stroke={hex} />
        <path d="M10 62 L18 32 Q28 26 38 32 L46 62 Z" fill={hex} fillOpacity="0.2" stroke={hex} />
      </svg>
    );
  }
  if (category === "lighting") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="18" fill="#e6c39a" />
        <path d="M28 2 L33 14 L23 14 Z" fill={hex} />
      </svg>
    );
  }
  // exposure / audio / editing default: aperture ring
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="spin-slow">
      <circle cx="30" cy="30" r="22" fill="none" stroke={hex} strokeWidth="3" />
      <circle cx="30" cy="30" r="8" fill={hex} fillOpacity="0.4" />
    </svg>
  );
}
