"use client";

import { useEffect, useState } from "react";
import { Panel, Slider, Segmented, Readout, Tag, cn } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { whiteBalancePoints, focalLengths } from "@/lib/guides";

/* ============== WHITE BALANCE ============== */
export function WhiteBalanceSim() {
  const [k, setK] = useState(5200);
  const [tint, setTint] = useState(0);
  const c = kelvinColor(k);
  const point = whiteBalancePoints.reduce((a, b) => (Math.abs(b.k - k) < Math.abs(a.k - k) ? b : a));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="WHITE BALANCE" title="Colour temperature simulator" accent="flare" right={<Tag accent="flare">{point.name}</Tag>}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong">
          <StillLife />
          <div className="sim-color-layer pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: `rgba(${c.r},${c.g},${c.b},0.5)` }} />
          <div className="sim-color-layer pointer-events-none absolute inset-0 mix-blend-color" style={{ background: tint < 0 ? `rgba(120,255,160,${Math.abs(tint) / 120})` : `rgba(255,120,200,${tint / 120})` }} />
          <span className="absolute left-3 top-3 tech text-[10px] text-[#f3ead9]">{k}K · {point.name}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {whiteBalancePoints.map((p) => (
            <button key={p.k} onClick={() => setK(p.k)} className="focus-ring rounded-sm border px-2.5 py-1.5 text-[11px] transition-colors" style={{ borderColor: p.k === k ? "#a8362a" : "var(--color-line)", color: p.k === k ? "#a8362a" : "var(--color-haze)" }}>
              {p.name}
            </button>
          ))}
        </div>
      </Panel>

      <div className="space-y-3">
        <Readout label="COLOUR TEMP" value={`${k}K`} accent="flare" sub={point.name} />
        <Slider label="KELVIN" value={k} min={1900} max={9000} step={50} onChange={setK} display={`${k}K`} accent="flare" />
        <Slider label="TINT (green ↔ magenta)" value={tint} min={-50} max={50} step={1} onChange={setTint} display={tint === 0 ? "0" : tint > 0 ? `+${tint} M` : `${tint} G`} accent="ok" />
        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">When to use what.</span> Use a <span className="text-flare">Kelvin</span> value for control and continuity;{" "}
          <span className="text-flare">presets</span> for speed; <span className="text-flare">custom</span> off a card for accuracy. Avoid{" "}
          <span className="text-rec">auto WB</span> in narrative work — it drifts as the subject moves.
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Tag accent="amber">Warm = low K (3200)</Tag>
          <Tag accent="info">Cool = high K (7500+)</Tag>
        </div>
      </div>
    </div>
  );
}

function kelvinColor(K: number) {
  if (K <= 5200) {
    const f = (5200 - K) / (5200 - 1900);
    return { r: 255, g: Math.round(255 - f * 95), b: Math.round(255 - f * 180) };
  }
  const f = (K - 5200) / (9000 - 5200);
  return { r: Math.round(255 - f * 90), g: Math.round(255 - f * 45), b: 255 };
}

function StillLife() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#332f29] to-[#191713]">
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-[#101a24]" />
      <div className="absolute left-[24%] top-[26%] h-24 w-24 rounded-full bg-[#e9c9a0]" />
      <div className="absolute right-[26%] top-[30%] h-20 w-20 rounded-sm bg-[#cf3b3b]" />
      <div className="absolute bottom-[20%] left-[40%] h-16 w-16 rounded-sm bg-[#cfd6dd]" />
      <div className="absolute bottom-[18%] right-[20%] h-12 w-28 rounded-sm bg-[#3b7fd6]" />
    </div>
  );
}

/* ============== AUDIO METER ============== */
export function AudioMeter() {
  const [tx, setTx] = useState(6);
  const [rx, setRx] = useState(0);
  const [cam, setCam] = useState(0);
  const [peak, setPeak] = useState(0);

  const total = tx + rx + cam; // dB relative
  const baseLevel = 50 + total * 1.6;

  useEffect(() => {
    const update = () => {
      const jitter = (Math.random() - 0.5) * 14;
      setPeak(Math.max(0, Math.min(100, baseLevel + jitter)));
    };
    update();
    const interval = window.setInterval(update, 140);
    return () => window.clearInterval(interval);
  }, [baseLevel]);

  const status = peak > 92 ? "CLIPPING" : peak < 22 ? "TOO QUIET / NOISY" : peak > 70 ? "STRONG" : "HEALTHY";
  const sColor = peak > 92 ? "#7d241d" : peak < 22 ? "#a8781f" : "#4c6b43";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="GAIN STAGING" title="Audio level simulator" accent="info" right={<Tag accent={peak > 92 ? "rec" : peak < 22 ? "amber" : "ok"} filled>{status}</Tag>}>
        <div className="flex items-end gap-3 rounded-sm inset p-5">
          <Meter level={peak} />
          <div className="flex-1 space-y-2">
            <ScaleMark db="-∞" pos={4} label="noise floor" color="#a8781f" />
            <ScaleMark db="-18" pos={48} label="target" color="#4c6b43" />
            <ScaleMark db="0" pos={92} label="clip" color="#7d241d" />
            <p className="pt-2 text-xs text-haze">
              {peak > 92
                ? "Signal is clipping — distortion. Lower a gain stage."
                : peak < 22
                ? "Signal is too low; raising it in post adds hiss. Add gain earlier in the chain."
                : "Healthy level with headroom. The signal is well above the noise floor and below clipping."}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Tag accent="info">Safety track: -10 dB channel</Tag>
          <Tag accent="ok">Target peak -12 to -6 dBFS</Tag>
        </div>
      </Panel>

      <div className="space-y-3">
        <Slider label="TRANSMITTER GAIN" value={tx} min={-20} max={40} step={1} onChange={setTx} display={`${tx > 0 ? "+" : ""}${tx} dB`} accent="flare" />
        <Slider label="RECEIVER OUTPUT" value={rx} min={-20} max={30} step={1} onChange={setRx} display={`${rx > 0 ? "+" : ""}${rx} dB`} accent="info" />
        <Slider label="CAMERA INPUT" value={cam} min={-20} max={30} step={1} onChange={setCam} display={`${cam > 0 ? "+" : ""}${cam} dB`} accent="ok" />
        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">Gain staging.</span> Set the strongest source
          (transmitter) first, then trim downstream. Each stage should pass a clean signal with
          headroom — never let two stages boost into clipping at once.
        </div>
      </div>
    </div>
  );
}

function Meter({ level }: { level: number }) {
  return (
    <div className="flex h-44 w-10 flex-col-reverse justify-start overflow-hidden rounded-sm border border-line-strong bg-[#0a0f17]">
      {Array.from({ length: 20 }).map((_, i) => {
        const segLevel = (i + 1) * 5;
        const active = level >= segLevel;
        const color = i >= 18 ? "#7d241d" : i >= 14 ? "#a8781f" : "#4c6b43";
        return (
          <div className="sim-meter-segment" key={i} style={{ height: "5%", background: active ? color : "transparent", opacity: active ? 0.9 : 0.15, margin: "1px 2px", borderRadius: 1 }} />
        );
      })}
    </div>
  );
}

function ScaleMark({ pos, label, color }: { db: string; pos: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px]" style={{ color }}>
      <span className="tech">{label}</span>
      <div className="h-px flex-1" style={{ background: color, opacity: 0.4 }} />
    </div>
  );
}

/* ============== LIGHTING ROOM ============== */
const patterns = [
  { id: "loop", name: "Loop", angle: 40 },
  { id: "rembrandt", name: "Rembrandt", angle: 60 },
  { id: "butterfly", name: "Butterfly", angle: 0 },
  { id: "split", name: "Split", angle: 90 },
  { id: "three-point", name: "Three-Point", angle: 45 },
  { id: "backlight", name: "Back / Rim", angle: 180 },
  { id: "high-key", name: "High-Key", angle: 30 },
  { id: "low-key", name: "Low-Key", angle: 65 },
];

export function LightingRoom() {
  const [pat, setPat] = useState("loop");
  const [ratio, setRatio] = useState(4); // key:fill
  const p = patterns.find((x) => x.id === pat)!;
  const angle = p.angle;
  const fill = 1 / ratio; // 0..1
  const hx = 50 + Math.cos((angle - 90) * (Math.PI / 180)) * 30;
  const hy = 45 + Math.sin((angle - 90) * (Math.PI / 180)) * 30;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="LIGHTING" title="Pattern & ratio simulator" accent="amber" right={<Tag accent="amber">{p.name}</Tag>}>
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-sm border border-line-strong bg-[#0a0d14]">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <radialGradient id="key" cx={`${hx}%`} cy={`${hy}%`} r="70%">
                <stop offset="0%" stopColor="#ffe4b8" />
                <stop offset="40%" stopColor="#caa070" />
                <stop offset="100%" stopColor="#1a1208" />
              </radialGradient>
            </defs>
            <circle className="sim-color-layer" cx="50" cy="48" r="34" fill={`url(#key)`} fillOpacity={0.55 + fill * 0.45} />
            <circle className="sim-color-layer" cx="50" cy="48" r="34" fill="#0a0d14" fillOpacity={pat === "low-key" ? 0.2 : 0} />
            {/* eyes */}
            <circle cx="40" cy="44" r="2.4" fill="#0a0d14" />
            <circle cx="60" cy="44" r="2.4" fill="#0a0d14" />
            {/* nose shadow hint for rembrandt */}
            {pat === "rembrandt" && <circle cx={angle > 0 ? 58 : 42} cy="55" r="3" fill="#0a0d14" fillOpacity="0.5" />}
          </svg>
          {/* key position indicator */}
          <div className="sim-scene-layer absolute" style={{ left: `${hx}%`, top: `${hy}%`, transform: "translate(-50%,-50%)" }}>
            <Icon name="sun" size={17} className="text-[#a8781f]" />
          </div>
          <span className="absolute left-3 top-3 tech text-[10px] text-amber">{p.name} · {ratio}:1</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
          {patterns.map((x) => (
            <button key={x.id} onClick={() => setPat(x.id)} className={cn("focus-ring shrink-0 rounded-sm px-2.5 py-1.5 text-[11px] font-semibold transition-colors")}
              style={x.id === pat ? { background: "#a8781f18", color: "#a8781f", boxShadow: "inset 0 0 0 1px #a8781f66" } : { color: "var(--color-haze)", boxShadow: "inset 0 0 0 1px var(--color-line)" }}>
              {x.name}
            </button>
          ))}
        </div>
      </Panel>

      <div className="space-y-3">
        <Slider label="KEY : FILL RATIO" value={ratio} min={1} max={8} step={0.5} onChange={setRatio} display={`${ratio}:1`} accent="amber" />
        <div className="rounded-sm inset p-3 text-xs text-haze">
          {p.id === "split"
            ? "Split lighting puts the key at 90° to light exactly half the face — conflict and duality."
            : p.id === "butterfly"
            ? "Butterfly places the key overhead for a symmetrical glamour shadow under the nose."
            : p.id === "low-key"
            ? "Low-key is mostly shadow with selective light — mystery and noir."
            : p.id === "high-key"
            ? "High-key is bright and soft with low contrast — comedy and commercial polish."
            : p.id === "backlight"
            ? "Back / rim light outlines the subject to separate it from the background."
            : `The key sits ${p.angle}° around the face. Raise the ratio to deepen shadows and add drama.`}
        </div>
        <Tag accent="amber">Negative fill deepens the shadow side</Tag>
      </div>
    </div>
  );
}

/* ============== LENS / FOCAL LENGTH ============== */
export function LensSim() {
  const [idx, setIdx] = useState(4); // 50mm
  const focal = focalLengths[idx].mm;
  const distort = focal < 50 ? (50 - focal) / 50 : 0; // wide stretches
  const compress = focal / 50;
  const fov = Math.round(2 * Math.atan(36 / (2 * focal)) * (180 / Math.PI)); // full-frame H FOV approx using 36mm sensor

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Panel label="LENS" title="Focal length & perspective" accent="info" right={<Tag accent="info">{focal}mm · {fov}°</Tag>}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
          <div className="sim-scene-layer absolute inset-0" style={{ transform: `scale(${compress})` }}>
            <div className="absolute bottom-[20%] left-0 right-0 flex items-end justify-around">
              {[34, 60, 26, 48, 70, 38, 52].map((h, i) => (
                <div key={i} className="bg-[#0c1622]" style={{ width: 18, height: h, boxShadow: "0 0 8px rgba(255,200,120,0.12)" }} />
              ))}
            </div>
          </div>
          {/* face with perspective distortion */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="sim-scene-layer" style={{ transform: `scaleX(${1 + distort * 0.5})`, transformOrigin: "center" }}>
              <svg width="90" height="110" viewBox="0 0 90 110">
                <ellipse cx="45" cy="48" rx="30" ry="38" fill="#e6c39a" />
                <ellipse cx="45" cy="48" rx="30" ry="38" fill="#375c7d" fillOpacity="0.06" />
                <circle cx="35" cy="44" r="3" fill="#2a1a0e" />
                <circle cx="55" cy="44" r="3" fill="#2a1a0e" />
              </svg>
            </div>
          </div>
          <span className="absolute left-3 top-3 tech text-[10px] text-info">{focal}mm</span>
          {distort > 0.1 && <span className="absolute bottom-3 right-3 tech text-[10px] text-rec">perspective stretch</span>}
        </div>
        <Segmented accent="info" size="sm" value={String(focal)} onChange={(v) => { const i = focalLengths.findIndex((f) => String(f.mm) === v); if (i >= 0) setIdx(i); }} options={focalLengths.map((f) => ({ value: String(f.mm), label: f.label }))} />
      </Panel>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Readout label="FIELD OF VIEW" value={`${fov}°`} accent="info" />
          <Readout label="COMPRESSION" value={`${compress.toFixed(2)}×`} accent="flare" />
        </div>
        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">Perspective vs magnification.</span> To keep the
          face the same size, you move the camera when you change focal length. Wide lenses force you
          close and stretch the face; telephotos push you back and compress the background.
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag accent="info">Wide = big FOV, stretched perspective</Tag>
          <Tag accent="flare">Tele = narrow FOV, compressed BG</Tag>
        </div>
      </div>
    </div>
  );
}
