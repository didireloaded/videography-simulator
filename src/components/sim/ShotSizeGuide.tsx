"use client";

import { useEffect, useRef, useState } from "react";
import { Panel, Tag } from "@/components/ui";
import { shotSizes } from "@/lib/guides";

const info: Record<string, { communicates: string; use: string; mistake: string }> = {
  ews: { communicates: "Scale, isolation, awe.", use: "Open a sequence, establish geography.", mistake: "No clear subject for the eye." },
  ws: { communicates: "Context and action.", use: "Show movement and environment.", mistake: "Too much headroom / dead space." },
  fs: { communicates: "Posture, costume, body.", use: "Dance, fights, walking-and-talking.", mistake: "Cutting off the feet or knees." },
  mws: { communicates: "A social, friendly distance.", use: "Group conversations and bridging beats.", mistake: "Cutting at the knee joint." },
  cs: { communicates: "Tension and readiness.", use: "Standoffs, hands and hips in frame.", mistake: "Cropping too high, losing weight." },
  ms: { communicates: "Conversational intimacy.", use: "The dialogue workhorse.", mistake: "Cutting wrists mid-gesture." },
  mcu: { communicates: "Warmth and emotional focus.", use: "Interviews and empathetic dialogue.", mistake: "Too much headroom." },
  cu: { communicates: "Interiority and emotion.", use: "Reactions and key story beats.", mistake: "No looking room, chin cut." },
  ecu: { communicates: "Intensity or obsession.", use: "Sparingly, for maximum emphasis.", mistake: "Overuse until it loses punch." },
};

export function ShotSizeGuide() {
  const [i, setI] = useState(6); // MCU
  const activePresetRef = useRef<HTMLButtonElement>(null);
  const size = shotSizes[i];
  const d = info[size.id];

  useEffect(() => {
    activePresetRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [i]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="VIEWFINDER" title="Shot framing" accent="info">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#292824] to-[#111113]">
          <Figure scale={size.crop} />
          {/* safe area + thirds */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <line x1="33.3%" y1="0" x2="33.3%" y2="100%" stroke="#ffffff" strokeOpacity="0.1" />
            <line x1="66.6%" y1="0" x2="66.6%" y2="100%" stroke="#ffffff" strokeOpacity="0.1" />
            <line x1="0" y1="33.3%" x2="100%" y2="33.3%" stroke="#ffffff" strokeOpacity="0.1" />
          </svg>
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_56px_rgba(0,0,0,0.34)]" />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md">{size.name}</span>
        </div>
        <div className="ios-segment-strip no-scrollbar mt-3 flex gap-1 overflow-x-auto rounded-full bg-[#e5e5ea] p-1">
          {shotSizes.map((s, idx) => (
            <button
              key={s.id}
              ref={idx === i ? activePresetRef : undefined}
              aria-pressed={idx === i}
              onClick={() => setI(idx)}
              className="focus-ring shrink-0 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors min-h-[36px]"
              style={
                idx === i
                  ? { background: "#ffffff", color: "#375c7d", boxShadow: "0 1px 3px rgba(0,0,0,.14)" }
                  : { color: "var(--color-haze)" }
              }
            >
              {s.name}
            </button>
          ))}
        </div>
      </Panel>

      <Panel label={size.name.toUpperCase()} title="Why this framing" accent="info">
        <dl key={size.id} className="sim-detail-enter space-y-3 text-sm">
          <div>
            <dt className="label-tag text-info">Communicates</dt>
            <dd className="mt-0.5 text-chalk">{d.communicates}</dd>
          </div>
          <div>
            <dt className="label-tag text-ok">When to use</dt>
            <dd className="mt-0.5 text-chalk">{d.use}</dd>
          </div>
          <div>
            <dt className="label-tag text-rec">Common mistake</dt>
            <dd className="mt-0.5 text-chalk">{d.mistake}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-haze">
          Shot size never works alone — it combines with angle, lens, movement and depth of field to
          shape meaning. Use the same figure to compare framings without the subject changing.
        </p>
      </Panel>
    </div>
  );
}

function Figure({ scale }: { scale: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center">
      <div className="sim-scene-layer" style={{ transform: `scale(${scale})`, transformOrigin: "bottom center" }}>
        <svg width="170" height="300" viewBox="0 0 170 300">
          <circle cx="85" cy="56" r="40" fill="#c79e76" />
          <circle cx="85" cy="56" r="40" fill="#ffd9a822" />
          <path d="M20 300 L40 150 Q85 128 130 150 L150 300 Z" fill="#252b34" />
          <path d="M20 300 L40 150 Q85 128 130 150 L150 300 Z" fill="#a8362a33" />
        </svg>
      </div>
    </div>
  );
}
