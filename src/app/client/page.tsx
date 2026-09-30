"use client";

import { useMemo, useState } from "react";
import { PageHeader, Panel, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { clientPhrases, findMovement, type ClientPhrase } from "@/lib/guides";

const SLUG_TO_KIND: Record<string, string> = {
  "dolly-in": "dollyIn",
  pan: "pan",
  tilt: "tilt",
  truck: "truck",
  pedestal: "pedestal",
  "dutch-angle": "static",
  zoom: "zoom",
  arc: "arc",
  "whip-pan": "whipPan",
  handheld: "handheld",
  static: "static",
  boom: "boom",
};

export default function ClientPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ClientPhrase>(clientPhrases[0]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientPhrases;
    return clientPhrases.filter((p) => p.says.toLowerCase().includes(q) || p.direction.toLowerCase().includes(q));
  }, [query]);

  const move = findMovement(SLUG_TO_KIND[selected.slug] ?? "static");

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Client mode"
        title="What Do They Mean?"
        description="Turn plain-language direction into the correct camera move, then show the crew a small reference loop."
        accent="flare"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Panel label="FIELD RECOGNITION" title="What did the client say?" accent="flare">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. “move closer to them”, “make it feel shaky”"
              className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-sm text-chalk placeholder:text-haze-2"
            />
          </div>
          <div className="mt-4 space-y-2">
            {matches.map((p) => {
              const active = selected.says === p.says;
              return (
                <button
                  key={p.says}
                  onClick={() => setSelected(p)}
                  className="focus-ring flex w-full items-center justify-between gap-3 rounded-sm border px-3.5 py-3 text-left transition-colors"
                  style={{
                    borderColor: active ? "var(--color-flare)" : "var(--color-line)",
                    background: active ? "var(--color-ink-2)" : "transparent",
                  }}
                >
                  <span className="text-sm font-medium text-chalk">“{p.says}”</span>
                  <span className="inline-flex items-center gap-1.5 tech shrink-0 text-xs font-bold text-flare">
                    <span>{p.direction}</span>
                    <Icon name="arrow-right" size={14} />
                  </span>
                </button>
              );
            })}
            {matches.length === 0 && <p className="text-sm text-haze py-4">No match — try searching “closer”, “turn”, “follow”, “raise”, or “rotate”.</p>}
          </div>
        </Panel>

        <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Panel label="FORMAL DIRECTION" title="Camera Report Entry" accent="flare" right={<Tag accent="flare" filled>{move?.abbr}</Tag>} pageNo="Translation">
            <div className="rounded-sm border border-line-strong bg-panel-2 p-4 text-center shadow-inner">
              <div className="label-tag text-flare flex items-center justify-center gap-1.5">
                <Icon name="camera" size={14} />
                <span>FORMAL DIRECTION</span>
              </div>
              <div className="cond mt-1.5 text-xl font-bold text-chalk">{selected.direction}</div>
            </div>
            {move && (
              <dl className="mt-5 space-y-3.5 text-sm divide-y divide-line">
                <div className="pt-2.5 first:pt-0">
                  <dt className="label-tag text-info">Operator Action</dt>
                  <dd className="mt-1 text-chalk font-medium">{move.operator}</dd>
                </div>
                <div className="pt-2.5">
                  <dt className="label-tag text-ok">Emotional Meaning</dt>
                  <dd className="mt-1 text-chalk font-medium">{move.feel}</dd>
                </div>
                <div className="pt-2.5">
                  <dt className="label-tag text-amber">Support Equipment</dt>
                  <dd className="mt-1 text-chalk font-medium">{move.equipment}</dd>
                </div>
              </dl>
            )}
          </Panel>
          <Panel label="ON-SET REFERENCE" title="Animated Mini-Preview" accent="info">
            <div className="relative aspect-video overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c] shadow-sm">
              <MiniMove kind={SLUG_TO_KIND[selected.slug] ?? "static"} />
            </div>
            <p className="mt-2.5 text-xs text-haze leading-relaxed">
              Demonstrate this animated loop on your monitor or phone so the entire grip and camera crew pictures the exact same trajectory.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MiniMove({ kind }: { kind: string }) {
  const isHoriz = kind === "pan" || kind === "truck" || kind === "tracking" || kind === "whipPan";
  const isVert = kind === "tilt" || kind === "pedestal" || kind === "boom";
  const cls = isHoriz ? "sweep" : isVert ? "floaty" : kind === "dollyIn" || kind === "zoom" ? "floaty" : kind === "handheld" ? "floaty" : "";
  return (
    <div className="absolute inset-0 flex items-center">
      <div className={`mx-auto h-10 w-24 rounded-sm ${cls}`} style={{ background: "linear-gradient(90deg,#a8362a,#d4983a,#a8362a)", filter: `blur(${kind === "whipPan" ? 8 : 0}px)` }} />
      {!isHoriz && kind !== "static" && kind !== "handheld" && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 tech text-[10px] text-[#cfc7b6]">scale / translation</span>
      )}
    </div>
  );
}
