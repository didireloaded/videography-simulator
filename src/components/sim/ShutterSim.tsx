"use client";

import { useState } from "react";
import { Panel, Segmented, Readout, Slider, Tag } from "@/components/ui";
import { frameRates } from "@/lib/guides";

const ANGLES = [45, 90, 135, 172.8, 180, 270, 360];

export function ShutterSim() {
  const [fps, setFps] = useState(24);
  const [angle, setAngle] = useState(180);
  const [playback, setPlayback] = useState(24);

  const angleRad = (angle / 360) * (1 / fps); // exposure time seconds
  const shutter = 1 / angleRad;
  const shutterLabel = formatShutter(shutter);
  const slowmo = playback < fps ? 1 : fps / playback; // playback slowdown factor

  // motion blur amount relative to 180°
  const blurPx = Math.round((angle / 180) * 18);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Panel label="MOTION BLUR" title="How movement renders" accent="amber">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
            <BlurPreview blur={blurPx} speed={fps >= 60 ? "fast" : "normal"} />
            <div className="absolute left-3 top-3 tech text-[10px] text-[#cfc7b6]">
              {angle}° · 1/{Math.round(shutter)}s at {fps}fps
            </div>
            <div className="absolute bottom-3 left-3 tech text-[10px] text-amber">
              {angle < 90
                ? "STACCATO / SHARP"
                : angle <= 200
                ? "NATURAL FILMIC MOTION"
                : "HEAVY MOTION SMEAR"}
            </div>
          </div>
          <p className="mt-3 text-xs text-haze">
            Wider shutter angles smear motion for a smooth, filmic feel. Narrow angles freeze each
            frame for a crisp, sometimes choppy, staccato look.
          </p>
        </Panel>

        <Panel label="COMPARE" title="Shutter angle side by side" accent="amber">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { a: 45, label: "45° Sharp" },
              { a: 90, label: "90°" },
              { a: 180, label: "180° Natural" },
              { a: 360, label: "360° Heavy" },
            ].map((p) => (
              <div key={p.a} className="space-y-1.5">
                <div className="relative aspect-square overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
                  <BlurPreview blur={Math.round((p.a / 180) * 18)} small />
                  <span className="absolute bottom-1 left-1.5 tech text-[9px] text-[#cfc7b6]">{p.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { t: "Slow-mo capture", d: "120fps plays slow in a 24p timeline" },
              { t: "Slow-mo playback", d: `1/{playback}× speed = ${slowmo.toFixed(2)}×` },
              { t: "Natural blur", d: "180° matches the eye's expectation" },
              { t: "Heavy blur", d: "360° smears — dreamy or messy" },
            ].map((x) => (
              <div key={x.t} className="rounded-sm inset px-2.5 py-2">
                <div className="label-tag !text-[9px]">{x.t}</div>
                <div className="mt-0.5 text-[11px] text-haze">{x.d}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Readout label="SHUTTER SPEED" value={shutterLabel} accent="amber" sub={`${angle}° angle`} />
          <Readout label="SLOW-MO" value={`${slowmo.toFixed(2)}×`} accent="flare" sub={`${fps}→${playback}fps`} />
        </div>

        <div className="rounded-sm inset p-3">
          <div className="label-tag mb-2 text-amber">FRAME RATE (CAPTURE)</div>
          <Segmented
            accent="amber"
            value={String(fps)}
            onChange={(v) => setFps(Number(v))}
            size="sm"
            options={frameRates.map((f) => ({ value: String(f), label: `${f}` }))}
          />
        </div>

        <div className="rounded-sm inset p-3">
          <div className="label-tag mb-2 text-amber">SHUTTER ANGLE</div>
          <Segmented
            accent="amber"
            value={String(angle)}
            onChange={(v) => setAngle(Number(v))}
            size="sm"
            options={ANGLES.map((a) => ({ value: String(a), label: `${a}°` }))}
          />
        </div>

        <Slider
          label="PLAYBACK TIMELINE"
          value={playback}
          min={12}
          max={120}
          step={1}
          onChange={setPlayback}
          display={`${playback} fps`}
          accent="flare"
        />

        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">The 180° rule.</span> For natural motion, set
          shutter near{" "}
          <span className="tech text-amber">1 ÷ (fps × 2)</span> — roughly a 180° shutter angle.
          At {fps}fps that&apos;s <span className="tech text-amber">1/{Math.round(fps * 2 * 10) / 10}s</span>. Higher
          frame rates need a faster shutter, so they need more light.
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag accent="amber">Flicker tip: test LED/HMI at high fps</Tag>
          <Tag accent="info">PAL: 25/50/100 · NTSC: 24/30/60/120</Tag>
        </div>
      </div>
    </div>
  );
}

function formatShutter(s: number) {
  const inv = Math.round(s);
  if (inv >= 1000) return `1/${inv}`;
  if (inv >= 100) return `1/${Math.round(inv / 10) * 10}`;
  return `1/${Math.round(inv)}`;
}

function BlurPreview({
  blur,
  small,
  speed,
}: {
  blur: number;
  small?: boolean;
  speed?: "normal" | "fast";
}) {
  const h = small ? "h-6 w-12" : "h-9 w-20";
  return (
    <div className="absolute inset-0 flex items-center">
      <div className={`sweep ${speed === "fast" ? "sweep-fast" : ""} mx-auto ${h} rounded-full bg-gradient-to-r from-flare via-amber to-flare`}
        style={{ filter: `blur(${Math.max(0, blur)}px)` }}
      />
    </div>
  );
}
