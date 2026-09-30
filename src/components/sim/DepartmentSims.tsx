"use client";

import React, { useState } from "react";
import { Panel, Slider, Segmented, Readout, Tag, cn } from "@/components/ui";
import { Icon } from "@/components/Icon";

/* ================== 1. DIRECTING 180° LINE SIMULATOR ================== */
export function Directing180Sim() {
  const [cameraPos, setCameraPos] = useState<"ots-a" | "ots-b" | "master" | "crossed">("ots-a");
  const [showLine, setShowLine] = useState(true);

  const setups = {
    "master": { label: "Master Setup (Wide)", side: "Safe Side (0°)", desc: "Establishes geography. Actor A is screen-left looking right; Actor B is screen-right looking left.", status: "SAFE", color: "#4c6b43" },
    "ots-a": { label: "OTS Actor A (CU on B)", side: "Safe Side (+45°)", desc: "Over A's left shoulder. Actor B remains on right side of frame looking left. Eyeline connects seamlessly.", status: "SAFE", color: "#4c6b43" },
    "ots-b": { label: "OTS Actor B (CU on A)", side: "Safe Side (-45°)", desc: "Over B's right shoulder. Actor A remains on left side of frame looking right. Eyeline matches reverse shot.", status: "SAFE", color: "#4c6b43" },
    "crossed": { label: "Crossed Camera (+135°)", side: "CROSSED LINE (VIOLATION)", desc: "Camera crossed the axis! Now both Actor A and Actor B are looking screen-right. In the edit, they appear to be ignoring each other or talking to a 3rd person.", status: "VIOLATION", color: "#7d241d" },
  };
  const current = setups[cameraPos];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <Panel label="TOP-DOWN STAGE DIAGRAM" title="180-Degree Line of Action" accent="info" right={<Tag accent={cameraPos === "crossed" ? "rec" : "ok"} filled>{current.status}</Tag>}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line-strong bg-[#191713] p-4 flex items-center justify-center">
            <svg viewBox="0 0 400 240" className="w-full h-full max-h-[300px]">
              {/* Floor grid */}
              <defs>
                <pattern id="grid180" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="240" fill="url(#grid180)" />

              {/* 180 Line */}
              {showLine && (
                <g>
                  <line x1="40" y1="120" x2="360" y2="120" stroke="#a8362a" strokeWidth="2.5" strokeDasharray="6 4" />
                  <text x="350" y="112" fill="#a8362a" fontSize="11" fontWeight="bold" fontFamily="monospace">180° AXIS</text>
                  <rect x="30" y="10" width="340" height="105" fill="#4c6b43" fillOpacity="0.08" />
                  <text x="40" y="25" fill="#4c6b43" fontSize="10" fontWeight="bold" fontFamily="monospace">SAFE 180° SEMICIRCLE</text>
                  <rect x="30" y="125" width="340" height="105" fill="#7d241d" fillOpacity="0.08" />
                  <text x="40" y="225" fill="#7d241d" fontSize="10" fontWeight="bold" fontFamily="monospace">CROSSED AXIS (DISORIENTATION)</text>
                </g>
              )}

              {/* Actor A (Left) */}
              <g transform="translate(120, 120)">
                <circle r="16" fill="#375c7d" />
                <circle r="22" fill="none" stroke="#375c7d" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 0 0 L 40 -12 L 40 12 Z" fill="#375c7d" fillOpacity="0.3" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">A</text>
                <text x="0" y="-28" textAnchor="middle" fill="#375c7d" fontSize="10" fontWeight="bold">ACTOR A (LOOKS RIGHT)</text>
              </g>

              {/* Actor B (Right) */}
              <g transform="translate(280, 120)">
                <circle r="16" fill="#a8781f" />
                <circle r="22" fill="none" stroke="#a8781f" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M 0 0 L -40 -12 L -40 12 Z" fill="#a8781f" fillOpacity="0.3" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">B</text>
                <text x="0" y="-28" textAnchor="middle" fill="#a8781f" fontSize="10" fontWeight="bold">ACTOR B (LOOKS LEFT)</text>
              </g>

              {/* Active Camera Setup */}
              {cameraPos === "master" && (
                <g transform="translate(200, 35)">
                  <path d="M -15 0 L 0 25 L 15 0 Z" fill="#4c6b43" />
                  <rect x="-18" y="-14" width="36" height="14" rx="2" fill="#fff" />
                  <text x="0" y="-4" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">MASTER</text>
                </g>
              )}
              {cameraPos === "ots-a" && (
                <g transform="translate(145, 60) rotate(-20)">
                  <path d="M -12 0 L 0 25 L 12 0 Z" fill="#4c6b43" />
                  <rect x="-16" y="-14" width="32" height="14" rx="2" fill="#fff" />
                  <text x="0" y="-4" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">OTS A</text>
                </g>
              )}
              {cameraPos === "ots-b" && (
                <g transform="translate(255, 60) rotate(20)">
                  <path d="M -12 0 L 0 25 L 12 0 Z" fill="#4c6b43" />
                  <rect x="-16" y="-14" width="32" height="14" rx="2" fill="#fff" />
                  <text x="0" y="-4" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">OTS B</text>
                </g>
              )}
              {cameraPos === "crossed" && (
                <g transform="translate(255, 180) rotate(160)">
                  <path d="M -12 0 L 0 25 L 12 0 Z" fill="#7d241d" />
                  <rect x="-18" y="-14" width="36" height="14" rx="2" fill="#ff8585" />
                  <text x="0" y="-4" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">CROSSED</text>
                </g>
              )}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(setups) as (keyof typeof setups)[]).map((k) => (
              <button
                key={k}
                onClick={() => setCameraPos(k)}
                className={`focus-ring px-3 py-1.5 rounded-sm text-xs font-bold transition-colors border ${
                  cameraPos === k
                    ? "bg-ink text-panel border-ink shadow-xs"
                    : "bg-panel-2 text-haze border-line hover:border-line-strong hover:text-chalk"
                }`}
              >
                {setups[k].label}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel label="EYELINE ANALYSIS" title={current.label} accent="info">
          <div className="rounded-sm border border-line-strong bg-panel-2 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label-tag">Camera Angle</span>
              <span className="tech text-xs font-bold" style={{ color: current.color }}>{current.side}</span>
            </div>
            <p className="text-sm text-chalk leading-relaxed">{current.desc}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-line space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-chalk">Display 180° Axis Line</span>
              <input
                type="checkbox"
                checked={showLine}
                onChange={(e) => setShowLine(e.target.checked)}
                className="h-4 w-4 rounded-sm accent-flare cursor-pointer"
              />
            </div>
            <p className="text-xs text-haze leading-normal">
              <strong>The 180° Rule:</strong> When cutting between two characters, keep every camera setup on the same semicircle. Moving across the line reverses their screen direction and breaks spatial continuity.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ================== 2. DIRECTING BLOCKING & COVERAGE SIMULATOR ================== */
export function DirectingBlockingSim() {
  const [staging, setStaging] = useState<"confrontation" | "intimate" | "dynamic">("confrontation");
  const [lensCoverage, setLensCoverage] = useState("wide-master");

  const stageNotes = {
    confrontation: { title: "Table Confrontation (Opposed)", desc: "Actors sit across from one another. Maximum emotional friction. Best covered with a 35mm Master and tight 85mm OTS reverses.", coverage: "3 Setups: 1x Master (35mm), 2x Matching OTS (85mm)." },
    intimate: { title: "Side-by-Side (Shared Gaze)", desc: "Actors sit side by side looking forward (e.g. car bench or wall). High intimacy or shared observation. Needs a profile 2-shot.", coverage: "2 Setups: 1x Profile Two-Shot (50mm), 1x Raking Master." },
    dynamic: { title: "Cross-Room Pursuit (Dynamic)", desc: "Actor A moves while Actor B remains static. Establishes power shift. Requires gimbal tracking or dolly counter-move.", coverage: "4 Setups: 1x Tracking Dolly (24mm), 2x Clean Singles, 1x Insert." },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="BLOCKING STUDIO" title="Actor Staging &amp; Camera Placements" accent="info">
        <div className="relative aspect-[16/9] rounded-sm border border-line-strong bg-[#1b1a17] p-6 flex flex-col justify-between text-[#f8f2e6]">
          <div className="flex justify-between items-start">
            <span className="tech text-xs font-bold text-info">STAGING: {stageNotes[staging].title.toUpperCase()}</span>
            <Tag accent="info">SET REPORT 02</Tag>
          </div>
          <div className="py-8 text-center space-y-2">
            <div className="cond text-xl font-bold text-chalk bg-panel inline-block px-4 py-2 rounded-sm shadow-md">
              {staging === "confrontation" && "[Camera Master] ──> [Actor A] ── Table ── [Actor B] <── [Reverses]"}
              {staging === "intimate" && "[Camera Profile] ──> [Actor A & Actor B Side-by-Side] ──> [Window]"}
              {staging === "dynamic" && "[Dolly Track] ──> [Actor A Moving Screen-Left] ──> [Static Actor B]"}
            </div>
            <p className="text-xs text-[#cfc7b6] max-w-md mx-auto">{stageNotes[staging].desc}</p>
          </div>
          <div className="flex justify-between items-end text-[11px] tech text-[#99907c]">
            <span>GRID: 10ft x 15ft LOCATION</span>
            <span>COVERAGE: {stageNotes[staging].coverage}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {(["confrontation", "intimate", "dynamic"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setStaging(k)}
              className={`focus-ring p-3 rounded-sm text-xs font-bold transition-colors border text-center capitalize ${
                staging === k ? "bg-info text-panel border-info shadow-xs" : "bg-panel-2 text-haze border-line hover:border-line-strong hover:text-chalk"
              }`}
            >
              {k} Staging
            </button>
          ))}
        </div>
      </Panel>

      <Panel label="COVERAGE MATRIX" title="Shot Motivation" accent="info">
        <div className="space-y-4 text-sm">
          <div>
            <div className="label-tag text-info">Recommended Lens Package</div>
            <div className="mt-1 tech font-bold text-chalk">24mm Wide · 50mm Normal · 85mm Portrait</div>
          </div>
          <div className="border-t border-line pt-3">
            <div className="label-tag">Director&apos;s Staging Rule</div>
            <p className="mt-1 text-xs text-haze leading-relaxed">
              Never lock camera marks before actors walk the scene. Let physical blocking dictate where the lens belongs so camera movement feels motivated rather than mechanical.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 3. LIGHTING STUDIO FLOOR PLAN BUILDER ================== */
export function LightingStudioSim() {
  const [keyPower, setKeyPower] = useState(100);
  const [fillPower, setFillPower] = useState(25);
  const [rimPower, setRimPower] = useState(50);
  const [negFill, setNegFill] = useState(true);

  const ratio = Math.round((keyPower / Math.max(fillPower, 1)) * 10) / 10;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="STUDIO FLOOR PLAN" title="Interactive 3-Point Lighting Rig" accent="amber" right={<Tag accent="amber">{ratio}:1 Ratio</Tag>}>
        <div className="relative aspect-[16/10] rounded-sm border border-line-strong bg-[#12110f] p-4 flex items-center justify-center">
          <svg viewBox="0 0 400 250" className="w-full h-full max-h-[300px]">
            <rect width="400" height="250" fill="#12110f" />
            {/* Subject in Center */}
            <circle cx="200" cy="125" r="18" fill="#e8dfcf" />
            <text x="200" y="129" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">SUBJ</text>

            {/* Camera Bottom Center */}
            <g transform="translate(200, 220)">
              <rect x="-12" y="-10" width="24" height="14" rx="2" fill="#a8362a" />
              <path d="M 0 -10 L -8 -22 L 8 -22 Z" fill="#a8362a" fillOpacity="0.5" />
              <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">CAM</text>
            </g>

            {/* Key Light (Top Left 45 deg) */}
            <g transform="translate(80, 50)">
              <circle r="14" fill="#a8781f" fillOpacity={keyPower / 100} />
              <circle r="14" fill="none" stroke="#a8781f" strokeWidth="2" />
              <line x1="0" y1="0" x2="105" y2="65" stroke="#a8781f" strokeWidth={keyPower / 25} strokeDasharray="4 2" strokeOpacity="0.7" />
              <text x="0" y="-20" textAnchor="middle" fill="#a8781f" fontSize="10" fontWeight="bold" fontFamily="monospace">KEY ({keyPower}%)</text>
            </g>

            {/* Fill Light (Top Right 45 deg) */}
            <g transform="translate(320, 60)">
              <circle r="12" fill="#5c81a0" fillOpacity={fillPower / 100} />
              <circle r="12" fill="none" stroke="#5c81a0" strokeWidth="2" />
              <line x1="0" y1="0" x2="-105" y2="55" stroke="#5c81a0" strokeWidth={Math.max(1, fillPower / 25)} strokeDasharray="4 2" strokeOpacity="0.7" />
              <text x="0" y="-20" textAnchor="middle" fill="#5c81a0" fontSize="10" fontWeight="bold" fontFamily="monospace">FILL ({fillPower}%)</text>
            </g>

            {/* Rim / Backlight (Bottom Left behind subject) */}
            <g transform="translate(130, 180)">
              <circle r="10" fill="#a8362a" fillOpacity={rimPower / 100} />
              <circle r="10" fill="none" stroke="#a8362a" strokeWidth="2" />
              <line x1="0" y1="0" x2="55" y2="-45" stroke="#a8362a" strokeWidth={Math.max(1, rimPower / 25)} strokeDasharray="2 2" strokeOpacity="0.7" />
              <text x="0" y="24" textAnchor="middle" fill="#a8362a" fontSize="10" fontWeight="bold" fontFamily="monospace">RIM ({rimPower}%)</text>
            </g>

            {/* Negative Fill Flag (Right side of subject) */}
            {negFill && (
              <g transform="translate(250, 125)">
                <rect x="-4" y="-30" width="8" height="60" fill="#221d17" stroke="#fff" strokeWidth="1" />
                <text x="18" y="4" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="monospace">NEG FLAG</text>
              </g>
            )}
          </svg>
        </div>
      </Panel>

      <Panel label="FIXTURE CONTROLS" title="Dimmer &amp; Ratio Board" accent="amber">
        <div className="space-y-4">
          <Slider label="KEY LIGHT (45° FRONT)" value={keyPower} min={10} max={100} step={5} onChange={setKeyPower} display={`${keyPower}%`} accent="amber" />
          <Slider label="FILL LIGHT (SOFT BOUNCE)" value={fillPower} min={0} max={100} step={5} onChange={setFillPower} display={`${fillPower}%`} accent="info" />
          <Slider label="RIM LIGHT (BACK HAIRLIGHT)" value={rimPower} min={0} max={100} step={5} onChange={setRimPower} display={`${rimPower}%`} accent="flare" />
          
          <div className="border-t border-line pt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-chalk">Rig 4x4 Solid Negative Fill Flag</span>
            <input type="checkbox" checked={negFill} onChange={(e) => setNegFill(e.target.checked)} className="h-4 w-4 accent-amber cursor-pointer" />
          </div>
          <div className="inset p-3 rounded-sm text-xs text-haze">
            <strong>Lighting Ratio Note:</strong> A {ratio}:1 ratio {ratio > 4 ? "creates deep, dramatic noir contrast." : ratio > 2 ? "provides natural, flattering separation for interviews." : "delivers bright, even commercial high-key lighting."}
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 4. AMPERAGE & CIRCUIT POWER CALCULATOR ================== */
export function LightingPowerSim() {
  const [fixtures, setFixtures] = useState([
    { id: 1, name: "1200W HMI Daylight Fresnel", watts: 1200, count: 1 },
    { id: 2, name: "650W Tungsten Arri Fresnel", watts: 650, count: 2 },
    { id: 3, name: "300W LED Astera Tube Kit", watts: 300, count: 1 },
  ]);
  const [voltage, setVoltage] = useState(120); // 120V US or 230V UK/EU
  const [breakerAmps, setBreakerAmps] = useState(20); // 15A or 20A household circuit

  const totalWatts = fixtures.reduce((sum, f) => sum + f.watts * f.count, 0);
  const totalAmps = Number((totalWatts / voltage).toFixed(1));
  const maxSafeAmps = breakerAmps * 0.8; // 80% safety rule
  const isOverload = totalAmps > maxSafeAmps;

  function updateCount(id: number, delta: number) {
    setFixtures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, count: Math.max(0, f.count + delta) } : f))
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="SET CIRCUIT CALCULATOR" title="Wattage &amp; Amperage Load Sheet" accent="amber" right={<Tag accent={isOverload ? "rec" : "ok"} filled>{isOverload ? "CIRCUIT OVERLOAD" : "SAFE LOAD"}</Tag>}>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-haze sm:hidden px-1">
            <span className="inline-flex items-center gap-1 text-amber">
              <Icon name="arrow-left" size={12} />
              <span>Swipe table horizontally</span>
              <Icon name="arrow-right" size={12} />
            </span>
            <span>{fixtures.length} fixtures</span>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[540px] border-collapse text-sm">
            <thead>
              <tr className="hairline-b text-left">
                <th className="label-tag py-2">Fixture Package</th>
                <th className="label-tag py-2 text-right">Unit Watts</th>
                <th className="label-tag py-2 text-center">Qty</th>
                <th className="label-tag py-2 text-right">Total Watts</th>
                <th className="label-tag py-2 text-right">Amps ({voltage}V)</th>
              </tr>
            </thead>
            <tbody>
              {fixtures.map((f) => {
                const amps = ((f.watts * f.count) / voltage).toFixed(1);
                return (
                  <tr key={f.id} className="hairline-b align-middle">
                    <td className="py-3 font-semibold text-chalk">{f.name}</td>
                    <td className="tech py-3 text-right text-haze">{f.watts}W</td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-2 border border-line rounded-sm px-2 py-0.5 bg-panel-2">
                        <button type="button" onClick={() => updateCount(f.id, -1)} className="text-haze hover:text-chalk font-bold px-1">━</button>
                        <span className="tech font-bold text-xs min-w-[16px]">{f.count}</span>
                        <button type="button" onClick={() => updateCount(f.id, 1)} className="text-haze hover:text-chalk font-bold px-1">✚</button>
                      </div>
                    </td>
                    <td className="tech py-3 text-right font-bold text-chalk">{f.watts * f.count}W</td>
                    <td className="tech py-3 text-right font-bold text-amber">{amps}A</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-ink-2/60 font-bold">
                <td colSpan={3} className="py-3 px-2 text-chalk">TOTAL ELECTRICAL DRAW</td>
                <td className="tech py-3 text-right text-chalk">{totalWatts}W</td>
                <td className={`tech py-3 text-right ${isOverload ? "text-rec font-extrabold" : "text-ok"}`}>{totalAmps}A</td>
              </tr>
            </tfoot>
          </table>
        </div>
        </div>

        <div className="mt-5 p-4 rounded-sm border border-line-strong bg-panel-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Breaker Load: {totalAmps}A / {breakerAmps}A Circuit</span>
            <span className={isOverload ? "text-rec" : "text-ok"}>{Math.round((totalAmps / breakerAmps) * 100)}% Capacity</span>
          </div>
          <div className="w-full bg-panel h-3 rounded-sm overflow-hidden border border-line">
            <div
              className={`h-full transition-all ${isOverload ? "bg-rec" : totalAmps > maxSafeAmps ? "bg-amber" : "bg-ok"}`}
              style={{ width: `${Math.min(100, (totalAmps / breakerAmps) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-haze leading-normal">
            <strong>The 80% Set Safety Rule:</strong> Continuous electrical loads must never exceed 80% of breaker capacity ({maxSafeAmps}A maximum on a {breakerAmps}A breaker). {isOverload && "⚠️ You must split fixtures across a second wall breaker or bring in a dedicated putt-putt generator!"}
          </p>
        </div>
      </Panel>

      <Panel label="CIRCUIT PARAMETERS" title="Voltage &amp; Breaker Setup" accent="amber">
        <div className="space-y-4">
          <div>
            <div className="label-tag mb-1.5">Location Voltage Standard</div>
            <Segmented
              accent="amber"
              value={String(voltage)}
              onChange={(v) => setVoltage(Number(v))}
              options={[
                { value: "120", label: "120V (US / CAN / JP)" },
                { value: "230", label: "230V (UK / EU / AU)" },
              ]}
            />
          </div>
          <div>
            <div className="label-tag mb-1.5">Wall Breaker Amperage</div>
            <Segmented
              accent="amber"
              value={String(breakerAmps)}
              onChange={(v) => setBreakerAmps(Number(v))}
              options={[
                { value: "15", label: "15A Household" },
                { value: "20", label: "20A Commercial / Set" },
              ]}
            />
          </div>
          <div className="border-t border-line pt-3 text-xs text-haze leading-relaxed">
            <strong>Field Formula:</strong> Amps = Watts ÷ Volts. On a 120V circuit, every 100 Watts draws roughly 0.83 Amps.
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 5. SOUND GAIN STAGING SIMULATOR ================== */
export function SoundGainSim() {
  const [txGain, setTxGain] = useState(12); // -20 to +30 dB
  const [rxOutput, setRxOutput] = useState(0); // line vs mic trim
  const [camPreamp, setCamPreamp] = useState(25); // 0 to 50

  const totalSignal = txGain + rxOutput + (camPreamp - 20);
  const peakDbFs = Math.min(0, Math.max(-60, -28 + totalSignal * 0.6));
  const isClipping = peakDbFs >= 0;
  const isTooQuiet = peakDbFs <= -35;
  const isSweetSpot = !isClipping && !isTooQuiet;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="WIRELESS AUDIO CHAIN" title="Transmitter to Recorder Gain Staging" accent="ok" right={<Tag accent={isClipping ? "rec" : isTooQuiet ? "amber" : "ok"} filled>{isClipping ? "CLIPPING DISTORTION" : isTooQuiet ? "NOISE FLOOR HISS" : "CLEAN -12 dBFS"}</Tag>}>
        <div className="rounded-sm border border-line-strong bg-[#191713] p-6 space-y-6 text-[#f8f2e6]">
          <div className="flex items-center justify-between text-xs tech">
            <span>SIGNAL PATH CHAIN</span>
            <span className="text-ok">RECORDER PEAK: {peakDbFs.toFixed(1)} dBFS</span>
          </div>

          {/* Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] tech font-mono text-[#99907c]">
              <span>-60 dB (NOISE)</span>
              <span>-30 dB</span>
              <span className="text-ok">-12 dB (TARGET)</span>
              <span className="text-rec">0 dB (CLIP)</span>
            </div>
            <div className="h-6 w-full bg-[#0f0e0c] rounded-sm border border-[#332f29] overflow-hidden p-1 flex items-center">
              <div
                className={`h-full transition-all duration-150 rounded-xs ${isClipping ? "bg-[#7d241d]" : isTooQuiet ? "bg-[#a8781f]" : "bg-[#4c6b43]"}`}
                style={{ width: `${Math.min(100, ((peakDbFs + 60) / 60) * 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center border-t border-[#332f29] pt-4">
            <div className="bg-[#221d17] p-3 rounded-sm border border-[#332f29]">
              <div className="text-[10px] text-[#99907c] uppercase">1. TX Trim</div>
              <div className="tech text-base font-bold mt-1 text-[#f8f2e6]">+{txGain} dB</div>
            </div>
            <div className="bg-[#221d17] p-3 rounded-sm border border-[#332f29]">
              <div className="text-[10px] text-[#99907c] uppercase">2. RX Output</div>
              <div className="tech text-base font-bold mt-1 text-[#f8f2e6]">{rxOutput >= 0 ? `+${rxOutput}` : rxOutput} dB</div>
            </div>
            <div className="bg-[#221d17] p-3 rounded-sm border border-[#332f29]">
              <div className="text-[10px] text-[#99907c] uppercase">3. Recorder Gain</div>
              <div className="tech text-base font-bold mt-1 text-[#f8f2e6]">{camPreamp} dB</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-sm bg-panel-2 border border-line text-xs text-haze leading-relaxed">
          <strong>Location Mixer Note:</strong> Always set your wireless transmitter (TX) gain as hot as possible without clipping the talent&apos;s voice. This keeps the signal above wireless RF transmission noise before trimming at the recorder preamp.
        </div>
      </Panel>

      <Panel label="PREAMP CONTROLS" title="Audio Signal Calibration" accent="ok">
        <div className="space-y-4">
          <Slider label="1. TRANSMITTER SENSITIVITY (TX)" value={txGain} min={-10} max={30} step={2} onChange={setTxGain} display={`${txGain >= 0 ? "+" : ""}${txGain} dB`} accent="ok" />
          <Slider label="2. RECEIVER OUTPUT LEVEL (RX)" value={rxOutput} min={-20} max={10} step={2} onChange={setRxOutput} display={`${rxOutput >= 0 ? "+" : ""}${rxOutput} dB`} accent="info" />
          <Slider label="3. CAMERA / RECORDER PREAMP" value={camPreamp} min={0} max={50} step={5} onChange={setCamPreamp} display={`${camPreamp} dB`} accent="amber" />
          
          <div className="border-t border-line pt-3 text-xs text-haze">
            <strong>Safety Track Rule:</strong> When recording volatile dialogue, assign receiver Channel 2 to a safety track attenuated exactly <strong>-10 dB</strong> below the main mix.
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 6. AD SHOOTING SCHEDULE & PAGE ESTIMATOR ================== */
export function AdScheduleSim() {
  const [pages, setPages] = useState(3.5); // script pages per day
  const [complexity, setComplexity] = useState<"low" | "medium" | "high">("medium");
  const [companyMoves, setCompanyMoves] = useState(1);

  const hoursPerMove = 1.5;
  const pageRates = { low: 1.2, medium: 2.1, high: 3.5 }; // hours per page
  const shootHours = Number((pages * pageRates[complexity] + companyMoves * hoursPerMove).toFixed(1));
  const isOvertime = shootHours > 10;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="AD LOGISTICS CALCULATOR" title="Daily Shoot Schedule &amp; Turnaround Estimator" accent="rec" right={<Tag accent={isOvertime ? "rec" : "ok"} filled>{isOvertime ? "OVERTIME WARNING (>10 HR)" : "ON SCHEDULE (<=10 HR)"}</Tag>}>
        <div className="rounded-sm border border-line-strong bg-panel p-5 space-y-5">
          <div className="grid grid-cols-3 gap-4 border-b border-line pb-4 text-center">
            <div>
              <div className="label-tag">Scheduled Pages</div>
              <div className="cond text-2xl font-bold mt-1 text-chalk">{pages} pgs ({pages * 8}/8ths)</div>
            </div>
            <div>
              <div className="label-tag">Company Moves</div>
              <div className="cond text-2xl font-bold mt-1 text-chalk">{companyMoves} move{companyMoves !== 1 ? "s" : ""}</div>
            </div>
            <div>
              <div className="label-tag">Est. Day Length</div>
              <div className={`cond text-2xl font-bold mt-1 ${isOvertime ? "text-rec" : "text-ok"}`}>{shootHours} Hours</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-chalk">
              <span>Day Breakdown Bar (10-Hour Standard Day)</span>
              <span className={isOvertime ? "text-rec font-bold" : "text-haze"}>{shootHours} / 10.0 hrs</span>
            </div>
            <div className="w-full bg-panel-2 h-5 rounded-sm overflow-hidden border border-line flex">
              <div
                className="bg-ok h-full transition-all flex items-center justify-center text-[10px] text-panel font-bold"
                style={{ width: `${Math.min(100, ((pages * pageRates[complexity]) / 10) * 100)}%` }}
              >
                Shoot ({((pages * pageRates[complexity]) / shootHours * 100).toFixed(0)}%)
              </div>
              {companyMoves > 0 && (
                <div
                  className="bg-amber h-full transition-all flex items-center justify-center text-[10px] text-panel font-bold"
                  style={{ width: `${Math.min(100, ((companyMoves * hoursPerMove) / 10) * 100)}%` }}
                >
                  Moves ({((companyMoves * hoursPerMove) / shootHours * 100).toFixed(0)}%)
                </div>
              )}
            </div>
          </div>

          <div className="inset p-4 rounded-sm space-y-2 text-xs text-haze leading-relaxed">
            <div className="font-bold text-chalk">1st AD Set Operations Rule:</div>
            <p>
              In narrative drama, average page completion is <strong>3.0 to 4.0 pages</strong> per 10-hour day. Every company move between physical locations costs an average of <strong>1.5 hours</strong> in wrap, transport, and re-lighting time.
            </p>
            {isOvertime && (
              <p className="text-rec font-semibold">
                ⚠️ Overtime Alert: This schedule exceeds a 10-hour shooting day. You must move a scene to another day or eliminate the company move to avoid crew meal penalties and turnaround violations!
              </p>
            )}
          </div>
        </div>
      </Panel>

      <Panel label="SCHEDULE PARAMETERS" title="Day &amp; Complexity Setup" accent="rec">
        <div className="space-y-4">
          <Slider label="SCRIPT PAGE COUNT (EIGHTHS)" value={pages} min={0.5} max={8.0} step={0.5} onChange={setPages} display={`${pages} pages (${pages * 8}/8)`} accent="rec" />
          
          <div>
            <div className="label-tag mb-1.5">Setup &amp; Stunt Complexity</div>
            <Segmented
              accent="rec"
              value={complexity}
              onChange={(v) => setComplexity(v as any)}
              options={[
                { value: "low", label: "Low (Dialogue)" },
                { value: "medium", label: "Medium (Standard)" },
                { value: "high", label: "High (Stunts/VFX)" },
              ]}
            />
          </div>

          <div>
            <div className="label-tag mb-1.5">Company Location Moves</div>
            <Segmented
              accent="rec"
              value={String(companyMoves)}
              onChange={(v) => setCompanyMoves(Number(v))}
              options={[
                { value: "0", label: "0 Moves (Single Stage)" },
                { value: "1", label: "1 Move (+1.5 hr)" },
                { value: "2", label: "2 Moves (+3.0 hr)" },
              ]}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 7. PRODUCTION BUDGET ALLOCATOR ================== */
export function ProdBudgetSim() {
  const [totalBudget, setTotalBudget] = useState(50000);

  const aboveTheLine = Math.round(totalBudget * 0.30);
  const belowTheLine = Math.round(totalBudget * 0.55);
  const postProd = Math.round(totalBudget * 0.15);
  const contingency = Math.round(totalBudget * 0.10); // 10% reserve from BTL/Post

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="FINANCIAL ALLOCATION" title="Above / Below-the-Line Budget Sheet" accent="info" right={<Tag accent="info" filled>${totalBudget.toLocaleString()} TOTAL</Tag>}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-haze sm:hidden px-1">
              <span className="inline-flex items-center gap-1 text-info">
                <Icon name="arrow-left" size={12} />
                <span>Swipe table horizontally</span>
                <Icon name="arrow-right" size={12} />
              </span>
              <span>3 tiers</span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[500px] border-collapse text-sm">
              <thead>
                <tr className="hairline-b text-left">
                  <th className="label-tag py-2">Budget Tier &amp; Department</th>
                  <th className="label-tag py-2 text-center">Industry %</th>
                  <th className="label-tag py-2 text-right">Allocation ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="py-3 font-semibold text-chalk">
                    <div>Above-the-Line (ATL)</div>
                    <div className="text-[11px] text-haze font-normal">Director, Producer, Writer, Principal Cast</div>
                  </td>
                  <td className="tech py-3 text-center text-info font-bold">30%</td>
                  <td className="tech py-3 text-right font-bold text-chalk">${aboveTheLine.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-chalk">
                    <div>Below-the-Line (BTL) Physical Production</div>
                    <div className="text-[11px] text-haze font-normal">Crew Payroll, Grip/Electric Gear, Locations, Catering</div>
                  </td>
                  <td className="tech py-3 text-center text-amber font-bold">55%</td>
                  <td className="tech py-3 text-right font-bold text-chalk">${belowTheLine.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-chalk">
                    <div>Post-Production &amp; Deliverables</div>
                    <div className="text-[11px] text-haze font-normal">Editing, Color Grading, Sound Design / Mix, Music Licensing</div>
                  </td>
                  <td className="tech py-3 text-center text-flare font-bold">15%</td>
                  <td className="tech py-3 text-right font-bold text-chalk">${postProd.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-ink-2/60 font-bold border-t-2 border-line-strong">
                  <td className="py-3 px-2 text-chalk">MANDATORY SET CONTINGENCY RESERVE</td>
                  <td className="tech py-3 text-center text-rec font-bold">10%</td>
                  <td className="tech py-3 text-right text-rec font-bold">${contingency.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          </div>

          <div className="inset p-4 rounded-sm text-xs text-haze leading-relaxed space-y-2">
            <div className="font-bold text-chalk">Line Producer Governance Note:</div>
            <p>
              In professional film finance, you must always bond a <strong>10% contingency reserve</strong> (${contingency.toLocaleString()}) to protect against overtime weather delays, equipment breakage, or emergency location changes. Never allocate 100% of physical funds before Day 1 of photography.
            </p>
          </div>
        </div>
      </Panel>

      <Panel label="BUDGET PARAMETERS" title="Total Project Expenditure" accent="info">
        <div className="space-y-4">
          <Slider label="TOTAL PRODUCTION BUDGET" value={totalBudget} min={10000} max={250000} step={5000} onChange={setTotalBudget} display={`$${totalBudget.toLocaleString()}`} accent="info" />
          <div className="border-t border-line pt-3 space-y-2 text-xs text-haze">
            <div className="font-semibold text-chalk">Quick Tier Shortcuts:</div>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setTotalBudget(15000)} className="focus-ring p-2 rounded-sm border border-line bg-panel-2 text-center tech hover:text-chalk">$15k Indie</button>
              <button type="button" onClick={() => setTotalBudget(75000)} className="focus-ring p-2 rounded-sm border border-line bg-panel-2 text-center tech hover:text-chalk">$75k Commercial</button>
              <button type="button" onClick={() => setTotalBudget(200000)} className="focus-ring p-2 rounded-sm border border-line bg-panel-2 text-center tech hover:text-chalk">$200k Pilot</button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 8. PRODUCTION DESIGN PALETTE BUILDER ================== */
export function ArtPaletteSim() {
  const [preset, setPreset] = useState<"noir" | "autumn" | "clinical" | "golden">("noir");

  const palettes = {
    noir: { title: "Gritty Subway Noir", mood: "Tense, urban, claustrophobic", colors: [{ name: "Steel Blue Wall (60%)", hex: "#2b3b4c" }, { name: "Sodium Vapor Lamp (30%)", hex: "#df9834" }, { name: "Briefcase Leather (10%)", hex: "#5a3a28" }, { name: "Wet Asphalt Neutral", hex: "#1c1e22" }, { name: "Subway Tile Contrast", hex: "#8a969e" }] },
    autumn: { title: "Warm Autumn Interior", mood: "Nostalgic, intimate, domestic", colors: [{ name: "Oak Wainscoting (60%)", hex: "#7a4e32" }, { name: "Beige Drapery (30%)", hex: "#d8c3a5" }, { name: "Burgundy Velvet Accent (10%)", hex: "#8a2b35" }, { name: "Linen Cream Neutral", hex: "#f0ebe1" }, { name: "Brass Fixture Contrast", hex: "#c29b38" }] },
    clinical: { title: "Hospital Clinical Sci-Fi", mood: "Sterile, alienating, observational", colors: [{ name: "Sanitary Cyan (60%)", hex: "#c4e0e5" }, { name: "Chrome Steel (30%)", hex: "#8c9ba1" }, { name: "Emergency Bio Red (10%)", hex: "#c93232" }, { name: "Fluorescent White Neutral", hex: "#f4f8f9" }, { name: "Scrub Green Contrast", hex: "#427a6c" }] },
    golden: { title: "Desert Golden Hour", mood: "Epic, arid, liberating", colors: [{ name: "Sandstone Earth (60%)", hex: "#c99a63" }, { name: "Terracotta Clay (30%)", hex: "#9e5330" }, { name: "Turquoise Sky Accent (10%)", hex: "#3b8fa3" }, { name: "Dust Ochre Neutral", hex: "#e6cfab" }, { name: "Sun-bleached Bone", hex: "#f5edd8" }] },
  };
  const active = palettes[preset];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="DESIGN PALETTE SHEET" title={active.title} accent="amber" right={<Tag accent="amber">{active.mood}</Tag>}>
        <div className="space-y-4">
          <div className="grid grid-cols-5 h-28 rounded-sm overflow-hidden border-2 border-chalk shadow-md">
            {active.colors.map((c, i) => (
              <div key={i} style={{ backgroundColor: c.hex }} className="h-full flex items-end p-2 text-panel font-mono text-[10px] font-bold drop-shadow-sm">
                {c.hex}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
            {active.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-sm border border-line bg-panel-2">
                <div style={{ backgroundColor: c.hex }} className="h-7 w-7 rounded-sm border border-line-strong shrink-0 shadow-xs" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-chalk truncate">{c.name}</div>
                  <div className="tech text-[10px] text-haze">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="inset p-4 rounded-sm text-xs text-haze leading-relaxed">
            <strong>Art Director &amp; Set Decorator Rule:</strong> Maintain a strict <strong>60-30-10 color ratio</strong> (60% dominant wall/environment, 30% secondary furniture/wardrobe, 10% hero prop accent). Never select wardrobe colors that match the 60% background wall without a separating rim light from cinematography!
          </div>
        </div>
      </Panel>

      <Panel label="PALETTE PRESETS" title="Select Narrative Theme" accent="amber">
        <div className="space-y-2.5">
          {(Object.keys(palettes) as (keyof typeof palettes)[]).map((k) => (
            <button
              key={k}
              onClick={() => setPreset(k)}
              className={`focus-ring w-full p-3 rounded-sm text-left transition-colors border flex items-center justify-between ${
                preset === k ? "bg-amber/10 border-amber text-chalk font-bold shadow-xs" : "bg-panel-2 border-line text-haze hover:border-line-strong hover:text-chalk"
              }`}
            >
              <div>
                <div className="text-xs font-bold">{palettes[k].title}</div>
                <div className="text-[10px] text-haze font-normal mt-0.5">{palettes[k].mood}</div>
              </div>
              <div className="flex -space-x-1 shrink-0">
                {palettes[k].colors.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ backgroundColor: c.hex }} className="h-4 w-4 rounded-full border border-panel shadow-xs" />
                ))}
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ================== 9. SCRIPT SUPERVISOR TAKE LOGGER ================== */
export function ScriptLoggerSim() {
  const [takes, setTakes] = useState([
    { id: 1, slate: "14A", take: 1, duration: "0:42", circle: false, notes: "False start on dialogue line 2." },
    { id: 2, slate: "14A", take: 2, duration: "1:15", circle: false, notes: "Clean dialogue, boom dipped into top frame at 0:58." },
    { id: 3, slate: "14A", take: 3, duration: "1:14", circle: true, notes: "PRINT. Perfect camera focus and emotional beat." },
  ]);

  function toggleCircle(id: number) {
    setTakes((prev) => prev.map((t) => (t.id === id ? { ...t, circle: !t.circle } : t)));
  }

  return (
    <div className="space-y-6">
      <Panel label="DAILY SCRIPT SUPERVISOR LOG" title="Interactive Slate &amp; Circle Take Sheet" accent="info" right={<Tag accent="info" filled>SCENE 14 — SUBWAY CAR</Tag>}>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-haze sm:hidden px-1">
            <span className="inline-flex items-center gap-1 text-info">
              <Icon name="arrow-left" size={12} />
              <span>Swipe table horizontally</span>
              <Icon name="arrow-right" size={12} />
            </span>
            <span>{takes.length} takes</span>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="hairline-b text-left">
                <th className="label-tag py-2">Slate</th>
                <th className="label-tag py-2 text-center">Take</th>
                <th className="label-tag py-2 text-center">Duration</th>
                <th className="label-tag py-2 text-center">Circle Take</th>
                <th className="label-tag py-2">Script Supervisor &amp; Editor Continuity Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {takes.map((t) => (
                <tr key={t.id} className={cn("align-middle transition-colors", t.circle && "bg-info/10 font-medium")}>
                  <td className="tech py-3 font-bold text-chalk">{t.slate}</td>
                  <td className="tech py-3 text-center font-bold text-chalk">#{t.take}</td>
                  <td className="tech py-3 text-center text-haze">{t.duration}</td>
                  <td className="py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleCircle(t.id)}
                      title="Mark as Director Approved Circle Take"
                      className="focus-ring chk mx-auto"
                      style={{ borderColor: t.circle ? "#375c7d" : undefined, background: t.circle ? "#375c7d" : "transparent" }}
                    >
                      {t.circle && <Icon name="check" size={14} className="text-[#f8f2e6]" />}
                    </button>
                  </td>
                  <td className="py-3 text-xs text-chalk">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        <div className="mt-5 p-4 rounded-sm border border-line-strong bg-panel-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-haze leading-normal">
            <strong>Continuity Handover Protocol:</strong> At the end of every shooting day, the Script Supervisor must deliver this signed take log directly to the DIT and Assistant Editor. A circled take indicates the director&apos;s authoritative preference for initial rough cut assembly.
          </div>
          <button
            type="button"
            onClick={() => {
              const nextTake = takes.length + 1;
              setTakes([...takes, { id: Date.now(), slate: "14A", take: nextTake, duration: "1:12", circle: false, notes: "Logged take — pending review." }]);
            }}
            className="focus-ring shrink-0 inline-flex items-center gap-1.5 rounded-sm bg-info px-4 py-2 text-xs font-bold text-panel hover:bg-info/90 shadow-xs"
          >
            <Icon name="plus" size={14} />
            <span>Log Take #{takes.length + 1}</span>
          </button>
        </div>
      </Panel>
    </div>
  );
}

/* ================== 10. EDITING STORAGE & PROXY CALCULATOR ================== */
export function PostStorageSim() {
  const [resolution, setResolution] = useState<"4k" | "6k" | "8k">("4k");
  const [codec, setCodec] = useState<"prores-hq" | "prores-proxy" | "raw" | "h265">("prores-hq");
  const [hours, setHours] = useState(15); // total shoot hours captured

  const gbPerMinute = {
    "prores-hq": { "4k": 5.5, "6k": 12.0, "8k": 22.0 },
    "prores-proxy": { "4k": 0.8, "6k": 1.8, "8k": 3.2 },
    "raw": { "4k": 15.0, "6k": 32.0, "8k": 65.0 },
    "h265": { "4k": 0.7, "6k": 1.5, "8k": 2.8 },
  };

  const ratePerMin = gbPerMinute[codec][resolution];
  const totalGb = Math.round(ratePerMin * 60 * hours);
  const totalTb = (totalGb / 1000).toFixed(2);
  const backupTb = ((totalGb * 2) / 1000).toFixed(2); // 3-2-1 backup rule

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="DATA WRANGLING & STORAGE SHEET" title="Post-Production Drive Requirement Calculator" accent="flare" right={<Tag accent="flare" filled>{totalTb} TB RAW STORAGE</Tag>}>
        <div className="rounded-sm border border-line-strong bg-panel p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 border-b border-line pb-5 text-center sm:grid-cols-3">
            <div>
              <div className="label-tag">Data Rate / Minute</div>
              <div className="tech text-xl font-bold mt-1 text-chalk">{ratePerMin} GB/min</div>
            </div>
            <div>
              <div className="label-tag">Total Ingest (1x Copy)</div>
              <div className="tech text-xl font-bold mt-1 text-flare">{totalTb} TB ({totalGb.toLocaleString()} GB)</div>
            </div>
            <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-3 sm:pt-0 border-line">
              <div className="label-tag">3-2-1 Mirror Backup (2x)</div>
              <div className="tech text-xl font-bold mt-1 text-info">{backupTb} TB Required</div>
            </div>
          </div>

          <div className="inset p-4 rounded-sm text-xs text-haze leading-relaxed space-y-2">
            <div className="font-bold text-chalk">DIT &amp; Assistant Editor Workflow Rule:</div>
            <p>
              Never edit directly off original camera cards or a single external drive. Under the mandatory <strong>3-2-1 Backup Protocol</strong>, you must maintain 3 total copies of all footage across 2 different storage media types, with 1 copy stored off-site. For {hours} hours of {resolution.toUpperCase()} footage, purchase at least two <strong>{Math.ceil(Number(totalTb) * 1.5)} TB RAID drives</strong> before principal photography begins.
            </p>
          </div>
        </div>
      </Panel>

      <Panel label="CODEC & TIMELINE SETUP" title="Format &amp; Duration Parameters" accent="flare">
        <div className="space-y-4">
          <div>
            <div className="label-tag mb-1.5">Camera Capture Resolution</div>
            <Segmented
              accent="flare"
              value={resolution}
              onChange={(v) => setResolution(v as any)}
              options={[
                { value: "4k", label: "4K UHD" },
                { value: "6k", label: "6K Cinema" },
                { value: "8k", label: "8K Full" },
              ]}
            />
          </div>

          <div>
            <div className="label-tag mb-1.5">Recording Codec / Format</div>
            <Segmented
              accent="flare"
              value={codec}
              onChange={(v) => setCodec(v as any)}
              options={[
                { value: "prores-hq", label: "ProRes 422 HQ (Standard)" },
                { value: "prores-proxy", label: "ProRes Proxy (Offline)" },
              ]}
            />
            <div className="mt-1.5">
              <Segmented
                accent="flare"
                value={codec}
                onChange={(v) => setCodec(v as any)}
                options={[
                  { value: "raw", label: "Uncompressed Cinema RAW" },
                  { value: "h265", label: "H.265 / MP4 (Compressed)" },
                ]}
              />
            </div>
          </div>

          <Slider label="TOTAL SHOOTING HOURS RECORDED" value={hours} min={1} max={100} step={1} onChange={setHours} display={`${hours} Hours`} accent="flare" />
        </div>
      </Panel>
    </div>
  );
}

/* ================== 11. SOUND RIGGING & PLACEMENT VISUALIZER ================== */
export function SoundRiggingSim() {
  const [rigType, setRigType] = useState<"overhead-boom" | "under-boom" | "hidden-lav" | "combo">("overhead-boom");
  const [env, setEnv] = useState<"quiet-int" | "noisy-ext" | "reverb-room">("quiet-int");

  const rigInfo = {
    "overhead-boom": {
      title: "Overhead Boom (Hypercardioid / Shotgun)",
      distance: "15 to 20 inches above mouth at 45° angle",
      sound: "Natural, rich acoustic perspective with natural chest resonance.",
      caution: "In reverberant rooms or noisy exteriors, room reflections or traffic can bleed into the wide acoustic lobe.",
    },
    "under-boom": {
      title: "Under-Boom / Table Rig",
      distance: "18 inches below chin, pointing up toward sternum",
      sound: "Strong low-end chest frequencies, useful when low ceilings prevent overhead booming.",
      caution: "Actor table bumps, script shuffling, or footsteps on wooden floors will transfer directly through the stand.",
    },
    "hidden-lav": {
      title: "Concealed Chest Lavalier (Omni)",
      distance: "Center chest over sternum, 6 to 8 inches below chin",
      sound: "Intimate, direct dialogue presence with maximum isolation from room noise.",
      caution: "Susceptible to clothing rustle, synthetic fabric scraping, and unnatural chest cavity bass boost.",
    },
    "combo": {
      title: "Dual-System Combo (Boom + Lav Mix)",
      distance: "Overhead boom on Track 1, Concealed Lav on Track 2",
      sound: "The industry standard narrative setup. Dialogue editor blends natural boom air with crisp lav presence.",
      caution: "Must maintain 3-to-1 acoustic phase distance rule or phase cancellation will hollow out vocal tone.",
    },
  };

  const current = rigInfo[rigType];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Panel label="ACOUSTIC RIGGING STAGE" title={current.title} accent="ok" right={<Tag accent="ok" filled>{env.replace("-", " ").toUpperCase()}</Tag>}>
        <div className="relative aspect-[16/10] rounded-sm border border-line-strong bg-[#12110f] p-4 flex items-center justify-center">
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[300px]">
            <rect width="400" height="240" fill="#12110f" />
            {/* Environment noise visual hint */}
            {env === "noisy-ext" && (
              <g stroke="#a8362a" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
                <line x1="10" y1="30" x2="390" y2="30" />
                <line x1="10" y1="210" x2="390" y2="210" />
                <text x="20" y="45" fill="#a8362a" fontSize="9" fontFamily="monospace">HIGH TRAFFIC / WIND NOISE FLOOR</text>
              </g>
            )}
            {env === "reverb-room" && (
              <g stroke="#a8781f" strokeWidth="1" strokeDasharray="2 2" opacity="0.4">
                <rect x="20" y="20" width="360" height="200" fill="none" />
                <text x="30" y="38" fill="#a8781f" fontSize="9" fontFamily="monospace">HARD REFLECTIVE WALLS (ECHO)</text>
              </g>
            )}

            {/* Actor Figure */}
            <g transform="translate(200, 140)">
              <circle cx="0" cy="-40" r="18" fill="#e8dfcf" />
              <rect x="-18" y="-20" width="36" height="60" rx="6" fill="#4c6b43" fillOpacity="0.4" stroke="#4c6b43" strokeWidth="2" />
              <text x="0" y="10" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">ACTOR</text>
            </g>

            {/* Overhead Boom */}
            {(rigType === "overhead-boom" || rigType === "combo") && (
              <g transform="translate(150, 40)">
                <line x1="-40" y1="-20" x2="15" y2="10" stroke="#a8781f" strokeWidth="4" />
                <rect x="15" y="5" width="28" height="10" rx="3" fill="#fff" transform="rotate(35 15 5)" />
                <path d="M 38 20 L 70 50" stroke="#a8781f" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="-10" y="-10" fill="#a8781f" fontSize="10" fontWeight="bold" fontFamily="monospace">OVERHEAD BOOM</text>
              </g>
            )}

            {/* Under-boom */}
            {rigType === "under-boom" && (
              <g transform="translate(160, 200)">
                <line x1="-30" y1="30" x2="10" y2="-10" stroke="#375c7d" strokeWidth="4" />
                <rect x="10" y="-15" width="26" height="10" rx="3" fill="#fff" transform="rotate(-35 10 -15)" />
                <path d="M 30 -25 L 55 -55" stroke="#375c7d" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="-10" y="25" fill="#375c7d" fontSize="10" fontWeight="bold" fontFamily="monospace">UNDER-BOOM</text>
              </g>
            )}

            {/* Lavalier */}
            {(rigType === "hidden-lav" || rigType === "combo") && (
              <g transform="translate(200, 120)">
                <circle cx="0" cy="0" r="4" fill="#a8362a" stroke="#fff" strokeWidth="1.5" />
                <path d="M 0 4 Q -10 30 -5 60" fill="none" stroke="#a8362a" strokeWidth="1.5" strokeDasharray="2 1" />
                <text x="25" y="4" fill="#a8362a" fontSize="9" fontWeight="bold" fontFamily="monospace">CHEST LAV</text>
              </g>
            )}
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["overhead-boom", "under-boom", "hidden-lav", "combo"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setRigType(k)}
              className={`focus-ring p-2.5 rounded-sm text-xs font-bold transition-colors border text-center ${
                rigType === k ? "bg-ok text-panel border-ok shadow-xs" : "bg-panel-2 text-haze border-line hover:border-line-strong hover:text-chalk"
              }`}
            >
              {k === "overhead-boom" ? "Overhead Boom" : k === "under-boom" ? "Under-Boom" : k === "hidden-lav" ? "Chest Lav" : "Dual Combo"}
            </button>
          ))}
        </div>
      </Panel>

      <Panel label="ACOUSTIC ANALYSIS" title="Rigging Specifications" accent="ok">
        <div className="space-y-4 text-sm">
          <div>
            <div className="label-tag text-ok">Optimal Placement Distance</div>
            <div className="mt-1 tech font-bold text-chalk">{current.distance}</div>
          </div>
          <div className="border-t border-line pt-3">
            <div className="label-tag">Acoustic Tone &amp; Perspective</div>
            <p className="mt-1 text-xs text-chalk leading-relaxed">{current.sound}</p>
          </div>
          <div className="border-t border-line pt-3">
            <div className="label-tag text-rec">Field Caution &amp; Trade-off</div>
            <p className="mt-1 text-xs text-haze leading-relaxed">{current.caution}</p>
          </div>

          <div className="border-t border-line pt-3">
            <div className="label-tag mb-1.5">Simulate Location Acoustics</div>
            <Segmented
              accent="ok"
              value={env}
              onChange={(v) => setEnv(v as any)}
              options={[
                { value: "quiet-int", label: "Quiet Studio" },
                { value: "reverb-room", label: "Hard Echo Room" },
                { value: "noisy-ext", label: "Noisy Exterior" },
              ]}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
