"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Panel, Segmented, Tag } from "@/components/ui";
import { movements, movementPairs, findMovement, type MoveDef, type MoveKind } from "@/lib/guides";

function usePhase(ms = 2600) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const loop = (now: number) => {
      if (start == null) start = now;
      setT(((now - start) % ms) / ms);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ms]);
  return t;
}

const tri = (t: number) => 1 - Math.abs(t * 2 - 1); // 0→1→0

function interp(path: [number, number][], t: number): [number, number] {
  if (path.length === 1) return path[0];
  const segs = path.length - 1;
  const scaled = t * segs;
  const i = Math.min(Math.floor(scaled), segs - 1);
  const frac = scaled - i;
  const a = path[i];
  const b = path[i + 1];
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
}

type View = {
  sub: number; subX: number; subY: number;
  bg: number; bgX: number; bgY: number; blur: number;
};

function lensView(kind: MoveKind, t: number): View {
  const base: View = { sub: 1, subX: 0, subY: 0, bg: 1, bgX: 0, bgY: 0, blur: 0 };
  const k = tri(t);
  const o = 0.5 - k; // -0.5..0.5
  switch (kind) {
    case "dollyIn": return { ...base, sub: 0.85 + 0.9 * k, bgX: -o * 60 };
    case "dollyOut": return { ...base, sub: 1.75 - 0.9 * k, bgX: o * 60 };
    case "zoom": return { ...base, sub: 0.85 + 0.9 * k, bg: 0.85 + 0.9 * k };
    case "dollyZoom": return { ...base, sub: 1, bg: 1.7 - 1.1 * k };
    case "truck": return { ...base, bgX: -o * 80 };
    case "tracking": return { ...base, bgX: -o * 90 };
    case "pan": return { ...base, bgX: -o * 55 };
    case "whipPan": return { ...base, bgX: -o * 150, blur: Math.abs(o) * 18 };
    case "tilt": return { ...base, subY: o * 34, bgY: o * 34 };
    case "pedestal": return { ...base, subY: o * 36 };
    case "boom": return { ...base, subY: o * 44, bg: 1.05, bgY: o * 22 };
    case "arc": return { ...base, subX: o * 22, bgX: -o * 36 };
    case "handheld": return { ...base, subX: Math.sin(t * 40) * 5, subY: Math.cos(t * 33) * 5 };
    case "static": return base;
    default: return base;
  }
}

export function MovementSim() {
  const [mode, setMode] = useState("single");
  const [kind, setKind] = useState<MoveKind>("dollyIn");
  const [pairIdx, setPairIdx] = useState(0);
  const move = findMovement(kind)!;
  const pair = movementPairs[pairIdx];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          accent="flare"
          value={mode}
          onChange={setMode}
          options={[
            { value: "single", label: "Single move" },
            { value: "compare", label: "Compare two" },
          ]}
        />
        {mode === "compare" && (
          <Segmented
            accent="info"
            value={String(pairIdx)}
            onChange={(v) => setPairIdx(Number(v))}
            size="sm"
            options={movementPairs.map((p, i) => ({ value: String(i), label: p.label }))}
          />
        )}
      </div>

      {mode === "single" ? (
        <SingleMove move={move} onSelect={setKind} current={kind} />
      ) : (
        <CompareMove a={findMovement(pair.a)!} b={findMovement(pair.b)!} />
      )}
    </div>
  );
}

function SingleMove({
  move,
  onSelect,
  current,
}: {
  move: MoveDef;
  onSelect: (k: MoveKind) => void;
  current: MoveKind;
}) {
  const t = usePhase(move.kind === "whipPan" ? 1300 : 2600);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <RoomView move={move} t={t} />
          <LensView move={move} t={t} />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {movements.map((m) => (
            <button
              key={m.kind}
              onClick={() => onSelect(m.kind)}
              className="focus-ring shrink-0 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors"
              style={
                m.kind === current
                  ? { background: "#a8362a18", color: "#a8362a", boxShadow: "inset 0 0 0 1px #a8362a66" }
                  : { color: "var(--color-haze)", boxShadow: "inset 0 0 0 1px var(--color-line)" }
              }
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <Panel label={move.abbr} title={move.name} accent="flare">
        <dl className="space-y-3 text-sm">
          <Info label="Operator does" accent="flare">{move.operator}</Info>
          <Info label="Equipment" accent="info">{move.equipment}</Info>
          <Info label="How it feels" accent="ok">{move.feel}</Info>
          <Info label="Common mistake" accent="rec">{move.mistake}</Info>
        </dl>
      </Panel>
    </div>
  );
}

function CompareMove({ a, b }: { a: MoveDef; b: MoveDef }) {
  const t = usePhase(2600);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[a, b].map((m) => (
        <div key={m.kind} className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag accent="flare" filled>{m.abbr}</Tag>
            <span className="text-sm font-semibold text-chalk">{m.name}</span>
          </div>
          <RoomView move={m} t={t} compact />
          <LensView move={m} t={t} compact />
          <p className="text-xs text-haze">{m.feel}</p>
        </div>
      ))}
    </div>
  );
}

function Info({ label, accent, children }: { label: string; accent: "flare" | "info" | "ok" | "rec"; children: React.ReactNode }) {
  const c = { flare: "#a8362a", info: "#375c7d", ok: "#4c6b43", rec: "#7d241d" }[accent];
  return (
    <div>
      <dt className="label-tag" style={{ color: c }}>{label}</dt>
      <dd className="mt-0.5 text-chalk">{children}</dd>
    </div>
  );
}

function RoomView({ move, t, compact }: { move: MoveDef; t: number; compact?: boolean }) {
  const k = move.rotates ? 0.5 - tri(t) : 0; // rotation offset -0.5..0.5
  const cam = move.rotates ? [50, 64] as [number, number] : interp(move.path, tri(t));
  const subj = { x: 50, y: 38 };
  const aimAt = move.rotates
    ? { x: subj.x + k * 60, y: subj.y }
    : subj;
  const ang = (Math.atan2(aimAt.y - cam[1], aimAt.x - cam[0]) * 180) / Math.PI;

  return (
    <Panel label="TOP-DOWN" title="Camera path" accent="flare" bodyClass="p-2">
      <div className={`relative aspect-[10/7] w-full overflow-hidden rounded-sm border border-line-strong bg-[#0a0f17]`}>
        <svg viewBox="0 0 100 70" className="h-full w-full">
          <rect x="2" y="2" width="96" height="66" fill="#0c1320" stroke="#283444" strokeWidth="0.6" rx="2" />
          {/* floor grid */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={2 + (i * 96) / 6} y1="2" x2={2 + (i * 96) / 6} y2="68" stroke="#ffffff" strokeOpacity="0.04" />
          ))}
          {/* path */}
          {move.path.length > 1 && (
            <polyline
              points={move.path.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke="#a8362a"
              strokeOpacity="0.4"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          )}
          {/* subject */}
          <circle cx={subj.x} cy={subj.y} r="3.4" fill="#375c7d" />
          <circle cx={subj.x} cy={subj.y} r="6" fill="none" stroke="#375c7d" strokeOpacity="0.4" strokeWidth="0.6" />
          {/* camera FOV cone */}
          <g transform={`translate(${cam[0]} ${cam[1]}) rotate(${ang})`}>
            <path d="M0 0 L26 -10 L26 10 Z" fill="#a8362a" fillOpacity="0.12" stroke="#a8362a" strokeOpacity="0.6" strokeWidth="0.6" />
          </g>
          {/* camera body */}
          <g transform={`translate(${cam[0]} ${cam[1]})`}>
            <rect x="-2.6" y="-2" width="5.2" height="4" rx="1" fill="#a8362a" />
            <rect x="2.4" y="-1" width="2" height="2" fill="#a8362a" />
          </g>
        </svg>
        {!compact && (
          <span className="absolute right-2 top-2 tech text-[9px] text-[#cfc7b6]">SUBJECT / CAMERA PATH</span>
        )}
      </div>
    </Panel>
  );
}

function LensView({ move, t, compact }: { move: MoveDef; t: number; compact?: boolean }) {
  const v = lensView(move.kind, t);
  return (
    <Panel label="LENS VIEW" title="What the lens sees" accent="info" bodyClass="p-2">
      <div className="relative aspect-[10/7] w-full overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
        {/* background layer (parallax / magnify) */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${v.bgX}px, ${v.bgY}px) scale(${v.bg})`,
            filter: `blur(${Math.min(v.blur, 14)}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#292722] to-[#12110f]" />
          <div className="absolute bottom-[26%] left-0 right-0 flex items-end justify-around">
            {[34, 60, 26, 48, 70, 38].map((h, i) => (
              <div key={i} className="bg-[#0c1622]" style={{ width: 16, height: h, boxShadow: "0 0 8px rgba(255,200,120,0.12)" }} />
            ))}
          </div>
        </div>
        {/* subject */}
        <div
          className="absolute bottom-[6%] left-1/2"
          style={{
            transform: `translate(calc(-50% + ${v.subX}px), ${v.subY}px) scale(${v.sub})`,
            transformOrigin: "bottom center",
          }}
        >
          <svg width="92" height="150" viewBox="0 0 92 150">
            <circle cx="46" cy="30" r="22" fill="#0f0e0c" />
            <circle cx="46" cy="30" r="22" fill="#ffd9a822" />
            <path d="M8 150 L24 72 Q46 58 68 72 L84 150 Z" fill="#0f0e0c" />
            <path d="M8 150 L24 72 Q46 58 68 72 L84 150 Z" fill="#a8362a22" />
          </svg>
        </div>
        {!compact && (
          <span className="absolute left-2 top-2 tech text-[9px] text-info">{move.abbr}</span>
        )}
      </div>
    </Panel>
  );
}
