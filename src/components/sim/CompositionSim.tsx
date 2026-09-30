"use client";

import { useRef, useState } from "react";
import { Panel, Toggle, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";

type Overlay =
  | "thirds" | "center" | "symmetry" | "leading" | "negative" | "headroom"
  | "looking" | "fwf" | "foreground" | "balance" | "diagonal";

const OVERLAYS: { id: Overlay; label: string }[] = [
  { id: "thirds", label: "Rule of thirds" },
  { id: "center", label: "Centre framing" },
  { id: "symmetry", label: "Symmetry axis" },
  { id: "leading", label: "Leading lines" },
  { id: "negative", label: "Negative space" },
  { id: "headroom", label: "Headroom guide" },
  { id: "looking", label: "Looking room" },
  { id: "fwf", label: "Frame in frame" },
  { id: "foreground", label: "Foreground layer" },
  { id: "balance", label: "Balance" },
  { id: "diagonal", label: "Diagonal" },
];

export function CompositionSim() {
  const [pos, setPos] = useState({ x: 32, y: 42 }); // % of frame (subject head)
  const [face, setFace] = useState<"left" | "right">("right");
  const [on, setOn] = useState<Record<string, boolean>>({ thirds: true, headroom: true, looking: true });
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function move(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
    const y = Math.max(4, Math.min(96, ((clientY - r.top) / r.height) * 100));
    setPos({ x, y });
  }

  const feedback = computeFeedback(pos, face);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Panel
          label="COMPOSITION SANDBOX"
          title="Move the subject, read the frame"
          accent="ok"
          right={
            <button
              onClick={() => setFace((f) => (f === "right" ? "left" : "right"))}
              className="focus-ring rounded-sm border border-line-strong px-2 py-1 text-xs text-haze"
            >
              Gaze: {face} →
            </button>
          }
        >
          <div
            ref={ref}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              move(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => dragging.current && move(e.clientX, e.clientY)}
            onPointerUp={() => (dragging.current = false)}
            className="relative aspect-[16/10] touch-none cursor-grab overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c] active:cursor-grabbing"
          >
            <Scene />
            <Overlays on={on} pos={pos} face={face} />
            {/* subject head */}
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="13" fill="#ffd9a8" />
                <circle cx="22" cy="22" r="13" fill="none" stroke="#fff" strokeOpacity="0.5" />
                <path
                  d={face === "right" ? "M30 22 L40 22 M36 18 L40 22 L36 26" : "M14 22 L4 22 M8 18 L4 22 L8 26"}
                  stroke="#a8362a"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div className="pointer-events-none absolute left-3 top-3 tech text-[10px] text-[#cfc7b6]">
              drag subject
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {feedback.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
                style={{
                  background: f.tone === "warn" ? "#7d241d12" : f.tone === "info" ? "#375c7d12" : "#4c6b4312",
                  color: f.tone === "warn" ? "#7d241d" : f.tone === "info" ? "#375c7d" : "#4c6b43",
                }}
              >
                {f.tone === "warn" ? <Icon name="alert" size={14} /> : f.tone === "info" ? <Icon name="info" size={14} /> : <Icon name="check" size={14} />}
                <span>{f.msg}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel label="OVERLAYS" title="Toggle guides" accent="ok">
        <div className="flex flex-wrap gap-2">
          {OVERLAYS.map((o) => (
            <Toggle
              key={o.id}
              accent="ok"
              on={!!on[o.id]}
              onChange={(v) => setOn((s) => ({ ...s, [o.id]: v }))}
              label={o.label}
            />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Tag accent="ok">Headroom</Tag>
          <p className="text-xs text-haze">
            Aim for a small gap above the head. Too much wastes space; too little feels cramped.
          </p>
          <Tag accent="ok">Looking room</Tag>
          <p className="text-xs text-haze">
            Leave more space in the direction the subject faces or moves into.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function computeFeedback(pos: { x: number; y: number }, face: "left" | "right") {
  const out: { msg: string; tone: "warn" | "info" | "ok" }[] = [];
  // headroom
  if (pos.y < 14) out.push({ msg: "Not enough headroom — feels cramped.", tone: "warn" });
  else if (pos.y > 55) out.push({ msg: "Too much headroom — wasted space above.", tone: "warn" });
  else out.push({ msg: "Headroom looks balanced.", tone: "ok" });

  // looking room
  const spaceInFront = face === "right" ? 100 - pos.x : pos.x;
  if (spaceInFront < 30) out.push({ msg: "Looking room is too tight on the gaze side.", tone: "warn" });
  else out.push({ msg: "Looking room gives the gaze space to breathe.", tone: "ok" });

  // centering
  if (Math.abs(pos.x - 50) < 6) out.push({ msg: "Subject is centred — formal / direct.", tone: "info" });
  else if (Math.abs(pos.x - 33) < 8 || Math.abs(pos.x - 66) < 8)
    out.push({ msg: "Subject sits on a thirds line.", tone: "ok" });
  else out.push({ msg: "Off-centre framing — feels dynamic.", tone: "info" });

  if (pos.x > 88 || pos.x < 12) out.push({ msg: "Subject too close to the edge — feels cut off.", tone: "warn" });
  return out;
}

function Scene() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2b2924] to-[#0f0e0c]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#0c1320]" />
      {/* leading lines / corridor */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path d="M0 100 L40 45 L60 45 L100 100 Z" fill="#101a2a" opacity="0.6" />
      </svg>
      <div className="absolute right-[24%] top-[16%] h-10 w-10 rounded-full bg-amber/60 blur-sm" />
    </div>
  );
}

function Overlays({
  on,
  pos,
  face,
}: {
  on: Record<string, boolean>;
  pos: { x: number; y: number };
  face: "left" | "right";
}) {
  const stroke = "#4c6b43";
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
      {on.thirds && (
        <g stroke={stroke} strokeOpacity="0.5" strokeWidth="1">
          <line x1="33.3%" y1="0" x2="33.3%" y2="100%" />
          <line x1="66.6%" y1="0" x2="66.6%" y2="100%" />
          <line x1="0" y1="33.3%" x2="100%" y2="33.3%" />
          <line x1="0" y1="66.6%" x2="100%" y2="66.6%" />
        </g>
      )}
      {on.center && (
        <g stroke="#375c7d" strokeOpacity="0.5" strokeWidth="1">
          <line x1="50%" y1="0" x2="50%" y2="100%" />
          <line x1="0" y1="50%" x2="100%" y2="50%" />
        </g>
      )}
      {on.symmetry && <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#a8362a" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4 4" />}
      {on.leading && (
        <g stroke={stroke} strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="6 5" className="dash-flow">
          <line x1="0" y1="100%" x2="50%" y2="45%" />
          <line x1="100%" y1="100%" x2="50%" y2="45%" />
          <line x1="0" y1="70%" x2="50%" y2="50%" />
          <line x1="100%" y1="70%" x2="50%" y2="50%" />
        </g>
      )}
      {on.negative && (
        <rect x={face === "right" ? "0%" : "62%"} y="0" width="38%" height="100%" fill="#375c7d" fillOpacity="0.07" stroke="#375c7d" strokeOpacity="0.3" />
      )}
      {on.headroom && (
        <g>
          <line x1="0" y1={`${pos.y - 6}%`} x2="100%" y2={`${pos.y - 6}%`} stroke="#a8781f" strokeOpacity="0.6" strokeWidth="1" />
          <rect x="0" y="0" width="100%" height={`${Math.max(0, pos.y - 6)}%`} fill="#a8781f" fillOpacity="0.05" />
        </g>
      )}
      {on.looking && (
        <rect
          x={face === "right" ? `${pos.x}%` : "0%"}
          y="0"
          width={`${face === "right" ? 100 - pos.x : pos.x}%`}
          height="100%"
          fill="#4c6b43"
          fillOpacity="0.06"
          stroke="#4c6b43"
          strokeOpacity="0.3"
        />
      )}
      {on.fwf && (
        <g stroke="#a8362a" strokeOpacity="0.6" strokeWidth="2" fill="none">
          <rect x="18%" y="20%" width="64%" height="64%" rx="2" />
        </g>
      )}
      {on.foreground && (
        <g fill="#7f8ba0" fillOpacity="0.25">
          <rect x="0" y="62%" width="22%" height="38%" />
          <rect x="78%" y="55%" width="22%" height="45%" />
        </g>
      )}
      {on.balance && (
        <g stroke="#375c7d" strokeOpacity="0.4">
          <circle cx="50%" cy="50%" r="42%" fill="none" />
        </g>
      )}
      {on.diagonal && (
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#7d241d" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="5 5" />
      )}
    </svg>
  );
}
