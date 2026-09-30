"use client";

import { useState } from "react";
import { Panel, Slider, Readout, Segmented, ApertureRing, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";

const FSTOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const FLABEL = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"];
const SHUTTERS = [1 / 12, 1 / 24, 1 / 25, 1 / 48, 1 / 50, 1 / 60, 1 / 100, 1 / 120, 1 / 250, 1 / 500, 1 / 1000];
const SHUTTER_LABEL = ["1/12", "1/24", "1/25", "1/48", "1/50", "1/60", "1/100", "1/120", "1/250", "1/500", "1/1000"];
const ISO_LIST = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];

const N0 = 2.8;
const T0 = 1 / 50;
const ISO0 = 400;

function log2(x: number) {
  return Math.log(x) / Math.log(2);
}

// stops from "correct" exposure baseline. Positive = darker.
function stopsFromCorrect(N: number, t: number, iso: number, nd: number) {
  return 2 * log2(N / N0) - log2(t / T0) - log2(iso / ISO0) + nd;
}

function snapIso(target: number) {
  let best = ISO_LIST[0];
  let bestD = Infinity;
  for (const iso of ISO_LIST) {
    const d = Math.abs(Math.log(iso) - Math.log(target));
    if (d < bestD) {
      bestD = d;
      best = iso;
    }
  }
  return best;
}

export function ExposureSim() {
  const [apIdx, setApIdx] = useState(3); // f/4
  const [shIdx, setShIdx] = useState(4); // 1/50
  const [iso, setIso] = useState(400);
  const [nd, setNd] = useState(0);
  const [autoIso, setAutoIso] = useState(true);
  const [lockShutter, setLockShutter] = useState(false);

  const N = FSTOPS[apIdx];
  const t = SHUTTERS[shIdx];

  // Auto ISO holds a constant reference brightness (EV).
  const liveIso = autoIso
    ? snapIso(ISO0 * Math.pow(2, 2 * log2(N / N0) - log2(t / T0) + nd))
    : iso;

  const stops = stopsFromCorrect(N, t, liveIso, nd);
  const brightness = Math.max(0.16, Math.min(2.4, Math.pow(2, -stops)));

  // Depth of field / background blur grows with wider aperture
  const dofBlur = Math.max(0, 22 * (1.6 - N) / 1.6);
  // Noise grows with ISO
  const noise = Math.max(0, Math.min(0.9, (Math.log(liveIso / 100) / Math.log(256)) * 0.9));

  function changeAp(next: number) {
    setApIdx(next);
  }
  function changeSh(next: number) {
    if (lockShutter) return;
    setShIdx(next);
  }

  const ev = Math.round(stops * 10) / 10;
  const evLabel = ev > 0.4 ? "UNDER" : ev < -0.4 ? "OVER" : "BALANCED";
  const evAccent = ev > 0.4 ? "amber" : ev < -0.4 ? "info" : "ok";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      {/* Preview */}
      <div className="space-y-4">
        <Panel label="LIVE PREVIEW" title="What the sensor sees" accent="flare" right={<Tag accent="flare">EV {ev > 0 ? "+" : ""}{ev}</Tag>}>
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong"
            style={{ filter: `brightness(${brightness})` }}
          >
            <ExposureScene bgBlur={dofBlur} />
            {/* grain */}
            <div
              className="grain pointer-events-none absolute inset-0 mix-blend-overlay"
              style={{ opacity: noise }}
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.7)]" />
            <Hud iso={liveIso} brightness={brightness} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tag accent={evAccent} filled>
              {evLabel}
            </Tag>
            <Tag accent="flare">APERTURE → DoF + brightness</Tag>
            <Tag accent="amber">SHUTTER → motion blur + brightness</Tag>
            <Tag accent="info">ISO → brightness + noise</Tag>
          </div>
        </Panel>

        <Panel label="DEPTH OF FIELD" title="Background separation" accent="flare">
          <div className="flex items-center gap-4">
            <ApertureRing openness={(1.6 - N) / 1.6} size={96} />
            <div className="flex-1 space-y-1 text-xs text-haze">
              <div className="flex justify-between"><span>Background blur</span><span className="tech text-chalk">{dofBlur.toFixed(0)}px</span></div>
              <BlurBar value={dofBlur / 22} />
              <p className="pt-1">
                {N <= 2
                  ? "Very shallow — eyes sharp, background melts away."
                  : N <= 4
                  ? "Moderate separation. Subject pops, background still readable."
                  : "Deep focus. Everything stays sharp from front to back."}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Readout label="APERTURE" value={FLABEL[apIdx]} accent="flare" sub="N = " />
          <Readout label="SHUTTER" value={SHUTTER_LABEL[shIdx]} accent="amber" sub={`${(t * 1000).toFixed(1)}ms`} />
          <Readout label="ISO" value={liveIso} accent="info" sub={autoIso ? "AUTO" : "MANUAL"} />
        </div>

        <Slider
          label="APERTURE"
          value={apIdx}
          min={0}
          max={FSTOPS.length - 1}
          step={1}
          onChange={(v) => changeAp(v)}
          display={FLABEL[apIdx]}
          accent="flare"
        />
        <Slider
          label="SHUTTER SPEED"
          value={shIdx}
          min={0}
          max={SHUTTERS.length - 1}
          step={1}
          onChange={(v) => changeSh(v)}
          display={SHUTTER_LABEL[shIdx]}
          accent="amber"
          locked={lockShutter}
          onToggleLock={() => setLockShutter((s) => !s)}
        />
        <Slider
          label="ND STRENGTH"
          value={nd}
          min={0}
          max={10}
          step={0.3}
          onChange={setNd}
          display={`ND${nd === 0 ? "0" : Math.round(nd * 10) / 10}`}
          accent="ok"
        />

        <div className="rounded-sm inset p-3">
          <div className="label-tag mb-2 text-info">ISO MODE</div>
          <Segmented
            accent="info"
            value={autoIso ? "auto" : "manual"}
            onChange={(v) => setAutoIso(v === "auto")}
            options={[
              { value: "auto", label: "Auto ISO", sub: "Lock exposure" },
              { value: "manual", label: "Manual ISO" },
            ]}
          />
          {!autoIso && (
            <div className="mt-3">
              <Slider
                label="ISO"
                value={iso}
                min={100}
                max={25600}
                step={100}
                onChange={setIso}
                display={`ISO ${iso}`}
                accent="info"
              />
            </div>
          )}
        </div>

        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">How it works.</span> Set aperture for depth of
          field and shutter for motion. With{" "}
          <span className="text-info">Auto ISO</span> on, the simulator holds a constant exposure and
          calculates ISO for you. Lock the shutter to protect your motion look.
        </div>

        <div className="rounded-sm border border-line-strong bg-panel p-3">
          <div className="label-tag mb-1.5">Camera Setup — written note</div>
          <pre className="tech whitespace-pre-wrap text-[13px] leading-relaxed text-chalk">
{`FPS       25
SHUTTER   ${SHUTTER_LABEL[shIdx]}
APERTURE  ${FLABEL[apIdx]}
ISO       ${liveIso}
ND        ${nd === 0 ? "0" : `ND${Math.round(nd * 10) / 10}`}`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function BlurBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-panel-3">
      <div
        className="h-full rounded-full bg-gradient-to-r from-flare to-flare-2"
        style={{ width: `${Math.min(100, value * 100)}%` }}
      />
    </div>
  );
}

function ExposureScene({ bgBlur }: { bgBlur: number }) {
  return (
    <div className="absolute inset-0">
      {/* background room */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg,#2b3f57 0%,#1a2737 55%,#101a26 100%)",
        }}
      />
      {/* back window glow */}
      <div
        className="absolute inset-0"
        style={{
          filter: `blur(${bgBlur}px)`,
          backgroundImage:
            "radial-gradient(120px 120px at 70% 35%, rgba(255,200,120,0.55), transparent 70%), radial-gradient(90px 60px at 28% 70%, rgba(120,170,255,0.3), transparent 70%)",
        }}
      />
      {/* midground subject */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg width="150" height="210" viewBox="0 0 150 210">
          <defs>
            <radialGradient id="rim" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffd9a8" />
              <stop offset="100%" stopColor="#1a1208" />
            </radialGradient>
          </defs>
          <ellipse cx="75" cy="60" rx="34" ry="40" fill="url(#rim)" />
          <path d="M30 210 L48 110 Q75 92 102 110 L120 210 Z" fill="#0b1119" />
          <path d="M30 210 L48 110 Q75 92 102 110 L120 210 Z" fill="#ffd9a833" />
        </svg>
      </div>
    </div>
  );
}

function Hud({ iso, brightness }: { iso: number; brightness: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="flex items-center justify-between">
        <span className="tech text-[10px] font-bold text-[#d8d0bf]">CAMERA TEST</span>
        <span className="tech text-[10px] text-[#d8d0bf]">ISO {iso}</span>
      </div>
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 tech text-[10px] text-[#d8d0bf]">
        <Icon name="sun" size={13} />
        <span>{(brightness * 100).toFixed(0)}% preview</span>
      </div>
    </div>
  );
}
