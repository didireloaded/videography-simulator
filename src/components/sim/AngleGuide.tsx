"use client";

import { useState } from "react";
import { Panel, Slider, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { angleList } from "@/lib/guides";

const info: Record<string, { communicates: string; use: string }> = {
  ground: { communicates: "Motion and scale near the floor; a low POV.", use: "Feet, vehicles, dramatic foregrounds." },
  low: { communicates: "Power, dominance, heroism or menace.", use: "Make a subject imposing or threatening." },
  knee: { communicates: "A stylised, slightly heroic tilt up.", use: "Fashion and grounded hero shots." },
  hip: { communicates: "Casual, grounded energy.", use: "Documentary-style mid-body coverage." },
  eye: { communicates: "Objectivity and empathy — neutral.", use: "The default for drama and interviews." },
  shoulder: { communicates: "Slightly observational.", use: "Subtle elevation for context." },
  high: { communicates: "Vulnerability, smallness, loss of power.", use: "When a character is overwhelmed." },
  birds: { communicates: "Omniscience, pattern, surveillance.", use: "Table tops, choreography, maps." },
};

export function AngleGuide() {
  const [deg, setDeg] = useState(0);
  const angle = angleList.reduce((a, b) => (Math.abs(b.deg - deg) < Math.abs(a.deg - deg) ? b : a));
  const d = info[angle.id];

  // distortion: low angle stretches + shifts up; high angle compresses + shifts down
  const skew = deg / 90; // -1..1
  const figScaleY = 1 + skew * 0.22;
  const figShift = -skew * 16;
  const floorH = 26 - skew * 10;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="ANGLE" title="Height & tilt shape power" accent="info" right={<Tag accent="info">{angle.name}</Tag>}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
          {/* floor */}
          <div className="sim-scene-layer absolute inset-x-0 bottom-0" style={{ height: `${floorH}%`, background: "#0c1320" }} />
          {/* figure */}
          <div
            className="sim-scene-layer absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ transform: `translateX(-50%) translateY(${figShift}px) scaleY(${figScaleY})`, transformOrigin: "bottom center" }}
          >
            <svg width="120" height="200" viewBox="0 0 120 200">
              <circle cx="60" cy="38" r="26" fill="#0f0e0c" />
              <circle cx="60" cy="38" r="26" fill="#ffd9a822" />
              <path d="M14 200 L30 100 Q60 84 90 100 L106 200 Z" fill="#0f0e0c" />
              <path d="M14 200 L30 100 Q60 84 90 100 L106 200 Z" fill="#a8362a20" />
            </svg>
          </div>
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.6)]" />
          <span className="absolute left-3 top-3 tech text-[10px] text-info">{angle.label} · {deg}°</span>
          {skew > 0.05 && <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 tech text-[10px] text-[#a8781f]"><Icon name="chevron-down" size={13} /><span>looking down</span></span>}
          {skew < -0.05 && <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 tech text-[10px] text-[#a8362a]"><Icon name="chevron-up" size={13} /><span>looking up</span></span>}
        </div>

        {/* mini diagram */}
        <div className="mt-3 flex items-end gap-2">
          {angleList.map((a) => (
            <button
              key={a.id}
              onClick={() => setDeg(a.deg)}
              className="flex-1 rounded-sm py-1.5 text-[9px] font-semibold transition-colors"
              style={{
                background: a.id === angle.id ? "#375c7d18" : "transparent",
                color: a.id === angle.id ? "#375c7d" : "var(--color-haze-2)",
                boxShadow: `inset 0 0 0 1px ${a.id === angle.id ? "#375c7d66" : "var(--color-line)"}`,
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
        <Slider
          label="CAMERA TILT"
          value={deg}
          min={-75}
          max={75}
          step={1}
          onChange={setDeg}
          display={`${deg}°`}
          accent="info"
        />
      </Panel>

      <Panel label={angle.name.toUpperCase()} title="What the angle says" accent="info">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="label-tag text-info">Communicates</dt>
            <dd className="mt-0.5 text-chalk">{d.communicates}</dd>
          </div>
          <div>
            <dt className="label-tag text-ok">When to use</dt>
            <dd className="mt-0.5 text-chalk">{d.use}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-haze">
          Eye level is neutral and disappears into the story. Move the camera below the subject to
          grant power, above it to take power away. Extreme angles are tools, not defaults.
        </p>
      </Panel>
    </div>
  );
}
