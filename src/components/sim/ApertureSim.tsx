"use client";

import { useState } from "react";
import { Panel, Slider, Segmented, Readout, Tag } from "@/components/ui";
import { apertures, focalLengths } from "@/lib/guides";

const FNUM = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

export function ApertureSim() {
  const [apIdx, setApIdx] = useState(1); // f/2
  const [subjectDist, setSubjectDist] = useState(0.4); // 0 close .. 1 far
  const [bgDist, setBgDist] = useState(0.7);
  const [focalIdx, setFocalIdx] = useState(4); // 50mm

  const N = FNUM[apIdx];
  const focal = focalLengths[focalIdx].mm;
  const compression = focal / 50;

  // blur in px
  const blur = Math.max(
    0,
    Math.round(((1 / N) * (focal / 50) * (1 / (subjectDist + 0.25)) * (bgDist + 0.15)) * 14)
  );
  const blurLabel =
    blur > 22 ? "Strong separation" : blur > 10 ? "Moderate blur" : blur > 3 ? "Soft" : "Deep focus";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Panel
          label="DEPTH OF FIELD"
          title="Background blur simulator"
          accent="flare"
          right={<Tag accent="flare">{blurLabel}</Tag>}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
            <DoFScene blur={blur} compression={compression} subjectDist={subjectDist} />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
            <div className="absolute left-3 top-3 tech text-[10px] text-flare">
              {apertures[apIdx]} · {focal}mm
            </div>
            <div className="absolute bottom-3 right-3 tech text-[10px] text-[#cfc7b6]">BG blur {blur}px</div>
          </div>
          <p className="mt-3 text-xs text-haze">
            Blur isn&apos;t aperture alone — it comes from a wider aperture{" "}
            <span className="text-flare">and</span> a closer subject, a farther background, and a
            longer focal length. Move the subject toward the camera or pull the background away to
            separate it.
          </p>
        </Panel>

        <Panel label="APERTURE STRIP" title="f/1.4 → f/16 comparison" accent="flare">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {apertures.map((label, i) => {
              const n = FNUM[i];
              const b = Math.max(0, Math.round(((1 / n) * (focal / 50) * (1 / (subjectDist + 0.25)) * (bgDist + 0.15)) * 14));
              return (
                <button
                  key={label}
                  onClick={() => setApIdx(i)}
                  className="space-y-1 rounded-sm border p-1.5 text-left transition-colors"
                  style={{
                    borderColor: i === apIdx ? "#a8362a88" : "var(--color-line)",
                    background: i === apIdx ? "#a8362a14" : "transparent",
                  }}
                >
                  <div className="relative aspect-square overflow-hidden rounded bg-gradient-to-b from-[#1b1a17] to-[#0f0e0c]">
                    <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-[#0b1119]" />
                    <div
                      className="absolute inset-0"
                      style={{
                        filter: `blur(${Math.min(b, 12)}px)`,
                        backgroundImage:
                          "radial-gradient(30px 30px at 70% 30%, rgba(255,200,120,0.5), transparent 70%)",
                      }}
                    />
                  </div>
                  <div className="tech text-center text-[10px] font-semibold text-chalk">{label}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Readout label="APERTURE" value={apertures[apIdx]} accent="flare" />
          <Readout label="FOCAL LENGTH" value={`${focal}mm`} accent="info" />
        </div>

        <Slider
          label="APERTURE"
          value={apIdx}
          min={0}
          max={FNUM.length - 1}
          step={1}
          onChange={setApIdx}
          display={apertures[apIdx]}
          accent="flare"
        />

        <Slider
          label="SUBJECT DISTANCE"
          value={subjectDist}
          min={0.1}
          max={1}
          step={0.05}
          onChange={setSubjectDist}
          display={subjectDist < 0.3 ? "Close" : subjectDist > 0.7 ? "Far" : "Mid"}
          accent="amber"
        />
        <Slider
          label="BACKGROUND DISTANCE"
          value={bgDist}
          min={0.1}
          max={1}
          step={0.05}
          onChange={setBgDist}
          display={bgDist < 0.3 ? "Near" : bgDist > 0.7 ? "Far" : "Mid"}
          accent="info"
        />

        <div className="rounded-sm inset p-3">
          <div className="label-tag mb-2 text-info">FOCAL LENGTH</div>
          <Segmented
            accent="info"
            size="sm"
            value={String(focal)}
            onChange={(v) => {
              const i = focalLengths.findIndex((f) => String(f.mm) === v);
              if (i >= 0) setFocalIdx(i);
            }}
            options={focalLengths.map((f) => ({ value: String(f.mm), label: f.label }))}
          />
        </div>

        <div className="rounded-sm inset p-3 text-xs text-haze">
          <span className="text-chalk font-semibold">The key idea.</span> A phone at f/1.8 can look
          sharp because its subject is usually far and the sensor is small. To blur a background: get
          closer, push the background farther, use a longer lens,{" "}
          <span className="text-flare">then</span> open the aperture.
        </div>
      </div>
    </div>
  );
}

function DoFScene({
  blur,
  compression,
  subjectDist,
}: {
  blur: number;
  compression: number;
  subjectDist: number;
}) {
  const subjScale = 1.4 - subjectDist * 0.7;
  return (
    <div className="absolute inset-0">
      {/* background city, compressed & blurred */}
      <div
        className="sim-optical-layer absolute inset-0"
        style={{
          filter: `blur(${Math.min(blur, 30)}px)`,
          transform: `scale(${1 + (compression - 1) * 0.5})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#292722] to-[#0f0e0c]" />
        <div className="absolute bottom-[18%] left-0 right-0 flex items-end justify-around opacity-90">
          {[40, 70, 30, 55, 80, 45, 65].map((h, i) => (
            <div
              key={i}
              className="bg-[#0c1622]"
              style={{ width: 26, height: h, borderRadius: 2, boxShadow: "0 0 10px rgba(255,200,120,0.15)" }}
            />
          ))}
        </div>
        <div className="absolute right-[18%] top-[20%] h-12 w-12 rounded-full bg-amber/70 blur-md" />
      </div>
      {/* subject */}
      <div
        className="sim-scene-layer absolute bottom-[8%] left-1/2 -translate-x-1/2"
        style={{ transform: `translateX(-50%) scale(${subjScale})` }}
      >
        <svg width="120" height="190" viewBox="0 0 120 190">
          <circle cx="60" cy="40" r="30" fill="#0f0e0c" />
          <circle cx="60" cy="40" r="30" fill="#ffd9a822" />
          <path d="M20 190 L36 92 Q60 76 84 92 L100 190 Z" fill="#0f0e0c" />
          <path d="M20 190 L36 92 Q60 76 84 92 L100 190 Z" fill="#a8362a22" />
        </svg>
      </div>
    </div>
  );
}
