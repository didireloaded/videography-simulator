import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { favourites } from "@/db/schema";
import { findTool } from "@/lib/tools";
import { topics } from "@/lib/content";
import { PageHeader } from "@/components/ui";
import { FavouriteToggle } from "@/components/FavouriteToggle";
import { Icon } from "@/components/Icon";
import { ShutterSim } from "@/components/sim/ShutterSim";
import { ApertureSim } from "@/components/sim/ApertureSim";
import { CompositionSim } from "@/components/sim/CompositionSim";
import { ShotSizeGuide } from "@/components/sim/ShotSizeGuide";
import { AngleGuide } from "@/components/sim/AngleGuide";
import { WhiteBalanceSim, AudioMeter, LightingRoom, LensSim } from "@/components/sim/MoreSims";
import FieldSimulator from "@/components/FieldSimulator";
import {
  Directing180Sim,
  DirectingBlockingSim,
  LightingStudioSim,
  LightingPowerSim,
  SoundGainSim,
  SoundRiggingSim,
  AdScheduleSim,
  ProdBudgetSim,
  ArtPaletteSim,
  ScriptLoggerSim,
  PostStorageSim,
} from "@/components/sim/DepartmentSims";
import { DepartmentAccessBoundary } from "@/components/DepartmentAccessBoundary";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const t = findTool(p.slug);
    return { title: t ? `${t.title} — FrameLab` : "Tool — FrameLab" };
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = findTool(slug);
  if (!tool) notFound();

  const rows = await db.select({ slug: favourites.slug }).from(favourites);
  const saved = new Set(rows.map((r) => r.slug));
  const related = topics.filter((t) => t.category === tool.category).slice(0, 4);

  return (
    <DepartmentAccessBoundary kind="tool" slug={slug}>
    <div className={`tool-page tool-page-${slug} space-y-6`}>
      <div className="tool-page-heading flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageHeader kicker={tool.kicker} title={tool.title} description={tool.description} accent={tool.accent} />
        </div>
        <FavouriteToggle slug={`tool-${tool.slug}`} title={tool.title} category="tool" accent={tool.accent} initialSaved={saved.has(`tool-${tool.slug}`)} />
      </div>

      <div className="fadeup">{renderTool(slug)}</div>

      {related.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-line">
          <div className="label-tag text-info flex items-center gap-1.5">
            <Icon name="book-open" size={14} />
            <span>RELATED DEPARTMENT FIELD NOTES &amp; CONCEPTS</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <Link key={t.slug} href={`/learn/${t.slug}`} className="focus-ring group rounded-sm border border-line-strong bg-panel p-3.5 transition-colors hover:bg-ink-2/40 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="cond text-base font-bold text-chalk group-hover:text-flare transition-colors">{t.name}</div>
                  <div className="mt-1.5 line-clamp-2 text-xs text-haze leading-relaxed">{t.definition}</div>
                </div>
                <div className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold text-flare">
                  <span>Open Sheet</span>
                  <Icon name="arrow-right" size={13} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
    </DepartmentAccessBoundary>
  );
}

function renderTool(slug: string) {
  switch (slug) {
    case "exposure": return <FieldSimulator initialTab="exposure" />;
    case "movement": return <FieldSimulator initialTab="movement" />;
    case "shutter": return <ShutterSim />;
    case "aperture": return <ApertureSim />;
    case "white-balance": return <WhiteBalanceSim />;
    case "composition": return <CompositionSim />;
    case "shot-sizes": return <ShotSizeGuide />;
    case "angles": return <AngleGuide />;
    case "lighting": return <LightingRoom />;
    case "audio": return <AudioMeter />;
    case "lens": return <LensSim />;
    case "directing-180": return <Directing180Sim />;
    case "directing-blocking": return <DirectingBlockingSim />;
    case "lighting-studio": return <LightingStudioSim />;
    case "lighting-power": return <LightingPowerSim />;
    case "sound-rigging": return <SoundRiggingSim />;
    case "sound-gain": return <SoundGainSim />;
    case "ad-schedule": return <AdScheduleSim />;
    case "prod-budget": return <ProdBudgetSim />;
    case "art-palette": return <ArtPaletteSim />;
    case "script-logger": return <ScriptLoggerSim />;
    case "post-storage": return <PostStorageSim />;
    default: return null;
  }
}
