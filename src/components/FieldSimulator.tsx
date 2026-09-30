"use client";

import { useEffect, useState } from "react";
import {
  Aperture,
  Camera,
  Columns2,
  Eye,
  Gauge,
  Info,
  Move,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Sun,
  Timer,
  TriangleAlert,
  Wrench,
} from "lucide-react";

type SimulatorTab = "exposure" | "movement";
type ExposurePresetId = "interview" | "daylight" | "event";
type ChangedSetting = "preset" | "aperture" | "shutter" | "iso" | "nd";
type MoveKind = "dollyIn" | "dollyOut" | "zoom" | "truck" | "pan" | "arc" | "handheld" | "static";

const ICON_STROKE = 1.75;

const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const SHUTTERS = [
  { seconds: 1 / 25, label: "1/25" },
  { seconds: 1 / 40, label: "1/40" },
  { seconds: 1 / 50, label: "1/50" },
  { seconds: 1 / 80, label: "1/80" },
  { seconds: 1 / 100, label: "1/100" },
  { seconds: 1 / 200, label: "1/200" },
  { seconds: 1 / 500, label: "1/500" },
  { seconds: 1 / 1000, label: "1/1000" },
];
const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
const ND_VALUES = [0, 1, 2, 3, 4, 5, 6];

const EXPOSURE_PRESETS = {
  interview: {
    label: "Interview setup",
    aperture: 2.8,
    shutterSeconds: 1 / 50,
    iso: 800,
    ndStops: 0,
  },
  daylight: {
    label: "Day exterior",
    aperture: 4,
    shutterSeconds: 1 / 100,
    iso: 100,
    ndStops: 4,
  },
  event: {
    label: "Low-light event",
    aperture: 1.4,
    shutterSeconds: 1 / 50,
    iso: 3200,
    ndStops: 0,
  },
} satisfies Record<
  ExposurePresetId,
  {
    label: string;
    aperture: number;
    shutterSeconds: number;
    iso: number;
    ndStops: number;
  }
>;

const MOVES: Record<
  MoveKind,
  {
    name: string;
    abbr: string;
    operator: string;
    feeling: string;
    equipment: string;
    confusion: string;
  }
> = {
  dollyIn: {
    name: "Dolly in",
    abbr: "DOLLY IN",
    operator: "Move the entire camera physically toward the subject.",
    feeling: "The viewer moves closer while perspective and spatial relationships change naturally.",
    equipment: "Dolly, slider, gimbal, handheld rig or careful tripod move.",
    confusion: "Do not confuse this with a zoom. A zoom changes focal length while the camera stays still.",
  },
  dollyOut: {
    name: "Dolly out",
    abbr: "DOLLY OUT",
    operator: "Move the entire camera physically away from the subject.",
    feeling: "The scene opens up and reveals more space around the subject.",
    equipment: "Dolly, slider, gimbal or controlled handheld movement.",
    confusion: "A zoom out magnifies less, but it does not create the same change in perspective.",
  },
  zoom: {
    name: "Zoom in",
    abbr: "ZOOM",
    operator: "Keep the camera fixed and increase the lens focal length.",
    feeling: "The image magnifies without the camera travelling through the room.",
    equipment: "Zoom lens, servo zoom or manual zoom ring.",
    confusion: "A dolly physically changes camera position. A zoom does not.",
  },
  truck: {
    name: "Truck left to right",
    abbr: "TRUCK",
    operator: "Move the whole camera sideways while keeping it aimed toward the subject.",
    feeling: "Foreground and background slide against one another and create parallax.",
    equipment: "Dolly, track, gimbal, slider or handheld rig.",
    confusion: "A pan rotates from one position. A truck changes the camera position.",
  },
  pan: {
    name: "Pan left to right",
    abbr: "PAN",
    operator: "Rotate the camera horizontally while its base remains in one place.",
    feeling: "The viewer scans across the scene without travelling through it.",
    equipment: "Fluid-head tripod, handheld camera or gimbal.",
    confusion: "A truck moves sideways. A pan only rotates.",
  },
  arc: {
    name: "Arc around subject",
    abbr: "ARC",
    operator: "Move the camera around the subject on a curved path while maintaining framing.",
    feeling: "The background shifts strongly and gives the subject presence and dimensionality.",
    equipment: "Gimbal, dolly track, handheld rig or steadicam.",
    confusion: "An orbit is a full or near-full circle. An arc can cover only part of the circle.",
  },
  handheld: {
    name: "Handheld",
    abbr: "HANDHELD",
    operator: "Hold the camera and allow controlled natural movement from the body.",
    feeling: "The shot feels immediate, present and less mechanically perfect.",
    equipment: "Camera body, shoulder rig, top handle or easyrig.",
    confusion: "Handheld does not mean random shaking. The movement still needs intention.",
  },
  static: {
    name: "Static shot",
    abbr: "STATIC",
    operator: "Keep the camera completely still and let action happen inside the frame.",
    feeling: "The viewer studies composition, blocking and performance without camera distraction.",
    equipment: "Tripod, locked head or a stable surface.",
    confusion: "A static shot can still feel active when the subject or background is moving.",
  },
};

const SPEEDS = [
  { label: "Slow", multiplier: 0.65 },
  { label: "Normal", multiplier: 1 },
  { label: "Fast", multiplier: 1.65 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function log2(value: number) {
  return Math.log(value) / Math.log(2);
}

function closestIndex(values: number[], target: number) {
  return values.reduce(
    (best, value, index) =>
      Math.abs(value - target) < Math.abs(values[best] - target) ? index : best,
    0,
  );
}

function closestShutterIndex(target: number) {
  return SHUTTERS.reduce(
    (best, shutter, index) =>
      Math.abs(shutter.seconds - target) < Math.abs(SHUTTERS[best].seconds - target)
        ? index
        : best,
    0,
  );
}

function exposureResult({
  aperture,
  shutterSeconds,
  iso,
  ndStops,
  reference,
}: {
  aperture: number;
  shutterSeconds: number;
  iso: number;
  ndStops: number;
  reference: (typeof EXPOSURE_PRESETS)[ExposurePresetId];
}) {
  const stops =
    2 * log2(aperture / reference.aperture) -
    log2(shutterSeconds / reference.shutterSeconds) -
    log2(iso / reference.iso) +
    (ndStops - reference.ndStops);

  const roundedStops = Number(stops.toFixed(2));
  const status = roundedStops > 0.4 ? "under" : roundedStops < -0.4 ? "over" : "balanced";
  const brightness = clamp(Math.pow(2, -roundedStops * 0.42), 0.38, 1.62);

  return { stops: roundedStops, status, brightness } as const;
}

function apertureBlur(aperture: number) {
  const normalized = log2(16 / clamp(aperture, 1.4, 16)) / log2(16 / 1.4);
  return clamp(normalized * 19, 0, 19);
}

function isoNoise(iso: number) {
  return clamp(Math.max(0, log2(Math.max(iso, 400) / 400)) * 0.09, 0, 0.58);
}

function movementFrame(kind: MoveKind, progress: number) {
  const p = clamp(progress, 0, 1);
  const centered = p - 0.5;

  switch (kind) {
    case "dollyIn":
      return {
        subjectScale: 0.82 + p * 0.82,
        subjectX: 0,
        subjectY: 0,
        backgroundScale: 0.96 + p * 0.12,
        backgroundX: centered * -12,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
    case "dollyOut":
      return {
        subjectScale: 1.64 - p * 0.82,
        subjectX: 0,
        subjectY: 0,
        backgroundScale: 1.08 - p * 0.12,
        backgroundX: centered * 12,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
    case "zoom":
      return {
        subjectScale: 0.84 + p * 0.72,
        subjectX: 0,
        subjectY: 0,
        backgroundScale: 0.84 + p * 0.72,
        backgroundX: 0,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
    case "truck":
      return {
        subjectScale: 1,
        subjectX: centered * -20,
        subjectY: 0,
        backgroundScale: 1,
        backgroundX: centered * -90,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
    case "pan":
      return {
        subjectScale: 1,
        subjectX: centered * -46,
        subjectY: 0,
        backgroundScale: 1,
        backgroundX: centered * -54,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
    case "arc":
      return {
        subjectScale: 1,
        subjectX: centered * 24,
        subjectY: 0,
        backgroundScale: 1.04,
        backgroundX: centered * -54,
        backgroundY: 0,
        motionBlur: 0,
        rotation: centered * 3,
      };
    case "handheld":
      return {
        subjectScale: 1,
        subjectX: Math.sin(p * Math.PI * 8) * 4,
        subjectY: Math.cos(p * Math.PI * 7) * 3,
        backgroundScale: 1,
        backgroundX: Math.sin(p * Math.PI * 6) * 2,
        backgroundY: 0,
        motionBlur: 0.7,
        rotation: Math.sin(p * Math.PI * 10) * 0.8,
      };
    case "static":
    default:
      return {
        subjectScale: 1,
        subjectX: 0,
        subjectY: 0,
        backgroundScale: 1,
        backgroundX: 0,
        backgroundY: 0,
        motionBlur: 0,
        rotation: 0,
      };
  }
}

function cameraPlanPosition(kind: MoveKind, progress: number) {
  const p = clamp(progress, 0, 1);

  switch (kind) {
    case "dollyIn":
      return { x: 50, y: 82 - p * 36, angle: -90 };
    case "dollyOut":
      return { x: 50, y: 46 + p * 36, angle: -90 };
    case "truck":
      return { x: 24 + p * 52, y: 68, angle: -90 };
    case "pan":
      return { x: 50, y: 72, angle: -125 + p * 70 };
    case "arc": {
      const radians = ((35 + p * 290) * Math.PI) / 180;
      const x = 50 + Math.cos(radians) * 31;
      const y = 32 + Math.sin(radians) * 31;
      const angle = (Math.atan2(32 - y, 50 - x) * 180) / Math.PI;
      return { x, y, angle };
    }
    case "handheld":
      return {
        x: 50 + Math.sin(p * Math.PI * 8) * 3,
        y: 72 + Math.cos(p * Math.PI * 7) * 2,
        angle: -90 + Math.sin(p * Math.PI * 10) * 3,
      };
    case "zoom":
    case "static":
    default:
      return { x: 50, y: 72, angle: -90 };
  }
}

export default function FieldSimulator({ initialTab = "exposure" }: { initialTab?: SimulatorTab }) {
  const [tab, setTab] = useState<SimulatorTab>(initialTab);

  return (
    <div className="fs-root">
      <div className="fs-topbar">
        <div>
          <span className="fs-eyebrow">Simulator study</span>
          <p className="fs-principle">Change one setting. See one clear consequence.</p>
        </div>
        <div className="fs-mobile-heading">
          <span>Exposure Lab</span>
          <small>Live camera study</small>
        </div>
        <span className="fs-page">FIELD TEST / 01</span>
      </div>

      <div className="fs-tabs" role="tablist" aria-label="Simulator tools">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "exposure"}
          className={`fs-tab ${tab === "exposure" ? "is-active" : ""}`}
          onClick={() => setTab("exposure")}
        >
          <Aperture size={17} strokeWidth={ICON_STROKE} />
          <span className="fs-tab-long">Exposure test</span><span className="fs-tab-short">Exposure</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "movement"}
          className={`fs-tab ${tab === "movement" ? "is-active" : ""}`}
          onClick={() => setTab("movement")}
        >
          <Move size={17} strokeWidth={ICON_STROKE} />
          <span className="fs-tab-long">Camera movement</span><span className="fs-tab-short">Movement</span>
        </button>
      </div>

      {tab === "exposure" ? <ExposureSimulator /> : <MovementSimulator />}

      <style jsx global>{`
        .fs-root {
          --fs-paper: #f1eadc;
          --fs-paper-deep: #e8dfcf;
          --fs-ink: #25211b;
          --fs-muted: #776f63;
          --fs-line: #b9ad9c;
          --fs-red: #a74635;
          --fs-blue: #365c71;
          width: 100%;
          overflow: hidden;
          color: var(--fs-ink);
          background-color: var(--fs-paper);
          border: 1px solid var(--fs-line);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .fs-root * { box-sizing: border-box; }

        .fs-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px 12px;
          border-bottom: 2px solid var(--fs-ink);
          background: rgba(241, 234, 220, 0.94);
        }

        .fs-eyebrow,
        .fs-label {
          display: block;
          color: var(--fs-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .fs-principle {
          margin: 4px 0 0;
          font-size: 13px;
          font-weight: 650;
        }

        .fs-page {
          flex: 0 0 auto;
          border: 1px solid var(--fs-line);
          padding: 3px 7px;
          color: var(--fs-muted);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
        }

        .fs-tabs {
          display: flex;
          border-bottom: 1px solid var(--fs-line);
          background: var(--fs-paper-deep);
        }

        .fs-mobile-heading { display: none; }

        .fs-tab {
          appearance: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 0;
          border-right: 1px solid var(--fs-line);
          border-bottom: 3px solid transparent;
          padding: 11px 16px 9px;
          color: var(--fs-muted);
          background: transparent;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .fs-tab.is-active {
          color: var(--fs-ink);
          border-bottom-color: var(--fs-red);
          background: var(--fs-paper);
        }

        .fs-tab-short { display: none; }

        .fs-tab:focus-visible,
        .fs-button:focus-visible,
        .fs-select:focus-visible,
        .fs-range:focus-visible {
          outline: 2px solid var(--fs-red);
          outline-offset: 2px;
        }

        .fs-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 22px;
          padding: 20px;
        }

        .fs-main { min-width: 0; }

        .fs-section-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--fs-ink);
        }

        .fs-section-head h2 {
          margin: 3px 0 0;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 700;
        }

        .fs-sidebar {
          padding-left: 20px;
          border-left: 1px solid var(--fs-line);
        }

        .fs-control {
          padding: 15px 0;
          border-bottom: 1px solid var(--fs-line);
        }

        .fs-control:first-child { padding-top: 0; }

        .fs-control-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .fs-control-name {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 750;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .fs-value {
          color: var(--fs-ink);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 16px;
          font-weight: 700;
        }

        .fs-helper {
          display: block;
          margin: 0 0 8px;
          color: var(--fs-muted);
          font-size: 11px;
          line-height: 1.4;
        }

        .fs-select {
          width: 100%;
          min-height: 40px;
          border: 1px solid var(--fs-ink);
          border-radius: 2px;
          padding: 9px 10px;
          color: var(--fs-ink);
          background: var(--fs-paper);
          font: inherit;
          font-size: 13px;
        }

        .fs-range {
          width: 100%;
          height: 6px;
          margin: 8px 0;
          accent-color: var(--fs-red);
          cursor: pointer;
        }

        .fs-monitor {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border: 8px solid #171717;
          background: #242424;
        }

        .fs-monitor::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 30;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .fs-scene {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #77746c;
          transition: filter 160ms ease, transform 160ms ease;
        }

        .fs-set {
          position: absolute;
          inset: 0;
          transform-origin: center;
          transition: filter 160ms ease, transform 160ms ease;
        }

        .fs-wall { position: absolute; inset: 0; background: #77766f; }

        .fs-window {
          position: absolute;
          left: 8%;
          top: 10%;
          width: 26%;
          height: 54%;
          border: 7px solid #33332f;
          background: #b6bfbd;
        }

        .fs-window::before,
        .fs-window::after {
          content: "";
          position: absolute;
          background: #33332f;
        }

        .fs-window::before { top: 0; bottom: 0; left: 49%; width: 4px; }
        .fs-window::after { left: 0; right: 0; top: 49%; height: 4px; }

        .fs-shelf {
          position: absolute;
          right: 7%;
          top: 13%;
          width: 24%;
          height: 45%;
          border: 5px solid #302d28;
          background: #514d45;
        }

        .fs-shelf::before,
        .fs-shelf::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          background: #302d28;
        }

        .fs-shelf::before { top: 32%; }
        .fs-shelf::after { top: 66%; }

        .fs-practical {
          position: absolute;
          right: 36%;
          top: 18%;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #dfb473;
          box-shadow: 0 0 0 10px rgba(223, 180, 115, 0.12);
        }

        .fs-table {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 24%;
          border-top: 5px solid #292521;
          background: #3d3730;
        }

        .fs-chart {
          position: absolute;
          right: 14%;
          bottom: 18%;
          width: 64px;
          height: 48px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          padding: 4px;
          background: #202020;
        }

        .fs-chart span:nth-child(1) { background: #745244; }
        .fs-chart span:nth-child(2) { background: #a88967; }
        .fs-chart span:nth-child(3) { background: #657a83; }
        .fs-chart span:nth-child(4) { background: #776e50; }
        .fs-chart span:nth-child(5) { background: #8b5d55; }
        .fs-chart span:nth-child(6) { background: #61735c; }
        .fs-chart span:nth-child(7) { background: #525f75; }
        .fs-chart span:nth-child(8) { background: #8c7449; }
        .fs-chart span:nth-child(9) { background: #d0cbc1; }
        .fs-chart span:nth-child(10) { background: #918e88; }
        .fs-chart span:nth-child(11) { background: #555451; }
        .fs-chart span:nth-child(12) { background: #262626; }

        .fs-subject {
          position: absolute;
          left: 50%;
          bottom: -3%;
          width: 34%;
          max-width: 190px;
          transform-origin: bottom center;
          transition: transform 160ms ease;
        }

        .fs-subject svg { display: block; width: 100%; height: auto; }

        .fs-hud {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 7px 10px;
          color: #eeeae2;
          background: rgba(12, 12, 12, 0.82);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
        }

        .fs-hud-top { top: 0; }
        .fs-hud-bottom { bottom: 0; }

        .fs-noise {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
          mix-blend-mode: soft-light;
        }

        .fs-compare-label {
          position: absolute;
          top: 40px;
          z-index: 22;
          padding: 4px 7px;
          color: white;
          background: rgba(0, 0, 0, 0.72);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .fs-meter {
          margin-top: 12px;
          padding: 8px 0 6px;
          border-top: 1px solid var(--fs-ink);
          border-bottom: 1px solid var(--fs-ink);
        }

        .fs-meter-track {
          position: relative;
          height: 18px;
          margin: 0 10px;
          border-bottom: 1px solid var(--fs-ink);
        }

        .fs-meter-zero {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: -4px;
          width: 2px;
          background: var(--fs-ink);
        }

        .fs-meter-marker {
          position: absolute;
          top: 2px;
          width: 10px;
          height: 10px;
          background: var(--fs-red);
          transform: translateX(-50%) rotate(45deg);
          transition: left 160ms ease;
        }

        .fs-meter-labels {
          display: flex;
          justify-content: space-between;
          padding: 4px 8px 0;
          color: var(--fs-muted);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 9px;
        }

        .fs-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .fs-button {
          appearance: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 35px;
          border: 1px solid var(--fs-ink);
          border-radius: 2px;
          padding: 7px 11px;
          color: var(--fs-ink);
          background: transparent;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .fs-button:hover { background: var(--fs-paper-deep); }
        .fs-button.is-primary { color: var(--fs-paper); background: var(--fs-ink); }

        .fs-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 14px;
          border-left: 4px solid var(--fs-blue);
          color: #29485a;
          background: rgba(54, 92, 113, 0.08);
          font-size: 12px;
          line-height: 1.55;
        }

        .fs-note.is-warning {
          border-left-color: var(--fs-red);
          color: #7c3024;
          background: rgba(167, 70, 53, 0.08);
        }

        .fs-note strong { display: block; margin-bottom: 3px; color: var(--fs-ink); }

        .fs-readouts {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid var(--fs-line);
        }

        .fs-readout span { display: block; }
        .fs-readout strong { display: block; margin-top: 3px; font-size: 13px; }

        .fs-diagram-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .fs-diagram {
          border: 1px solid var(--fs-ink);
          padding: 10px;
          background: var(--fs-paper-deep);
        }

        .fs-diagram h3 {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .fs-floorplan {
          display: block;
          width: 100%;
          height: auto;
          background-image:
            linear-gradient(rgba(37, 33, 27, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 33, 27, 0.06) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .fs-progress {
          height: 8px;
          margin-top: 10px;
          border: 1px solid var(--fs-ink);
        }

        .fs-progress > div { height: 100%; background: var(--fs-red); }

        .fs-detail {
          display: grid;
          grid-template-columns: 20px 1fr;
          gap: 9px;
          padding: 13px 0;
          border-bottom: 1px solid var(--fs-line);
          font-size: 12px;
          line-height: 1.5;
        }

        .fs-detail strong {
          display: block;
          margin-bottom: 2px;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        @media (max-width: 800px) {
          .tool-page-exposure { margin-inline: 0; }
          .tool-page-exposure .tool-page-heading { display: none; }
          .tool-page-exposure > .fadeup { margin-top: 0 !important; animation: none; }

          .fs-root {
            --fs-paper: #f2f2f7;
            --fs-paper-deep: #e5e5ea;
            --fs-ink: #1c1c1e;
            --fs-muted: #6e6e73;
            --fs-line: rgba(60, 60, 67, 0.18);
            --fs-red: #007aff;
            --fs-blue: #007aff;
            overflow: visible;
            border: 0;
            border-radius: 0;
            background: var(--fs-paper);
            box-shadow: none;
          }

          .fs-topbar {
            display: flex;
            align-items: center;
            flex-direction: row;
            padding: 14px 16px 8px;
            border: 0;
            background: var(--fs-paper);
          }

          .fs-topbar > div:first-child { display: none; }
          .fs-mobile-heading { display: block; }
          .fs-mobile-heading span {
            display: block;
            font-size: 24px;
            font-weight: 750;
            letter-spacing: -0.035em;
          }
          .fs-mobile-heading small { display: block; margin-top: 2px; color: var(--fs-muted); font-size: 12px; }
          .fs-page { border: 0; color: var(--fs-red); font-size: 11px; font-weight: 700; }

          .fs-tabs {
            position: relative;
            z-index: 5;
            gap: 4px;
            margin: 8px 16px 14px;
            padding: 3px;
            border: 0;
            border-radius: 10px;
            background: #e3e3e8;
          }

          .fs-tab {
            min-width: 0;
            min-height: 42px;
            border: 0;
            border-radius: 12px;
            color: var(--fs-muted);
            font-size: 11px;
            white-space: nowrap;
          }

          .fs-tab-long { display: none; }
          .fs-tab-short { display: inline; }

          .fs-tab.is-active {
            border: 0;
            color: var(--fs-ink);
            background: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          }

          .fs-workspace { grid-template-columns: 1fr; gap: 0; padding: 0 16px 16px; }
          .fs-main { background: transparent; }
          .fs-section-head { display: none; }

          .fs-monitor {
            aspect-ratio: 4 / 5;
            border: 0;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14);
          }

          .fs-monitor::after { border-color: rgba(255, 255, 255, 0.12); }

          .fs-hud {
            padding: 10px 12px;
            background: rgba(5, 5, 6, 0.72);
            backdrop-filter: blur(16px);
          }

          .fs-meter {
            margin: 12px 0 0;
            padding: 10px 14px 8px;
            border: 0;
            border-radius: 14px;
            background: #fff;
          }

          .fs-meter-zero { background: var(--fs-ink); }
          .fs-meter-marker { background: var(--fs-red); }

          .fs-buttons {
            justify-content: center;
            padding: 12px 12px 0;
            background: transparent;
          }

          .fs-button {
            min-height: 44px;
            border-color: transparent;
            border-radius: 12px;
            color: var(--fs-red);
            background: #fff;
          }

          .fs-button.is-primary { color: white; background: var(--fs-red); }

          .fs-readouts {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0;
            margin: 12px 0 0;
            padding: 14px 12px;
            border: 0;
            border-radius: 14px;
            background: #fff;
          }

          .fs-readout {
            min-width: 0;
            padding-inline: 10px;
            border-right: 1px solid var(--fs-line);
            text-align: center;
          }

          .fs-readout:last-child { border-right: 0; }
          .fs-readout strong { overflow-wrap: anywhere; color: var(--fs-ink); }

          .fs-sidebar {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-top: 14px;
            padding: 14px;
            border: 0;
            border-radius: 20px;
            background: #fff;
          }

          .fs-control {
            min-width: 0;
            padding: 12px;
            border: 0;
            border-radius: 14px;
            background: #f2f2f7;
          }

          .fs-control:first-child { grid-column: 1 / -1; padding-top: 12px; }
          .fs-control-head { margin-bottom: 6px; }
          .fs-control-name { font-size: 11px; letter-spacing: 0.04em; }
          .fs-value { color: var(--fs-red); font-size: 15px; }
          .fs-helper { display: none; }

          .fs-select {
            min-height: 44px;
            border-color: transparent;
            border-radius: 11px;
            color: var(--fs-ink);
            background: #e5e5ea;
          }

          .fs-range { margin: 10px 0 2px; accent-color: var(--fs-red); }
          .fs-sidebar > div:last-child { grid-column: 1 / -1; padding-top: 0 !important; }
          .fs-note { border-radius: 12px; }
          .fs-diagram-grid { grid-template-columns: 1fr; }
          .fs-tab { flex: 1; justify-content: center; padding-inline: 8px; }
        }

        @media (max-width: 520px) {
          .fs-hud { font-size: 8px; }
          .fs-section-head h2 { font-size: 19px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-scene,
          .fs-set,
          .fs-subject,
          .fs-meter-marker { transition: none; }
        }
      `}</style>
    </div>
  );
}

function ExposureSimulator() {
  const [presetId, setPresetId] = useState<ExposurePresetId>("interview");
  const [apertureIndex, setApertureIndex] = useState(2);
  const [shutterIndex, setShutterIndex] = useState(2);
  const [isoIndex, setIsoIndex] = useState(3);
  const [ndIndex, setNdIndex] = useState(0);
  const [compare, setCompare] = useState(false);
  const [lastChanged, setLastChanged] = useState<ChangedSetting>("preset");

  const reference = EXPOSURE_PRESETS[presetId];
  const aperture = APERTURES[apertureIndex];
  const shutter = SHUTTERS[shutterIndex];
  const iso = ISO_VALUES[isoIndex];
  const ndStops = ND_VALUES[ndIndex];
  const exposure = exposureResult({
    aperture,
    shutterSeconds: shutter.seconds,
    iso,
    ndStops,
    reference,
  });

  const backgroundBlur = apertureBlur(aperture);
  const referenceBlur = apertureBlur(reference.aperture);
  const noise = isoNoise(iso);
  const referenceNoise = isoNoise(reference.iso);
  const motionBlur = clamp((shutter.seconds / reference.shutterSeconds - 1) * 1.6, 0, 2.8);

  function applyPreset(nextPreset: ExposurePresetId) {
    const preset = EXPOSURE_PRESETS[nextPreset];
    setPresetId(nextPreset);
    setApertureIndex(closestIndex(APERTURES, preset.aperture));
    setShutterIndex(closestShutterIndex(preset.shutterSeconds));
    setIsoIndex(closestIndex(ISO_VALUES, preset.iso));
    setNdIndex(closestIndex(ND_VALUES, preset.ndStops));
    setCompare(false);
    setLastChanged("preset");
  }

  function reset() {
    applyPreset(presetId);
  }

  const feedback = getExposureFeedback({
    status: exposure.status,
    stops: exposure.stops,
    lastChanged,
    aperture,
    shutterSeconds: shutter.seconds,
    iso,
    ndStops,
    reference,
  });

  const statusLabel =
    exposure.status === "balanced"
      ? "BALANCED"
      : exposure.status === "under"
        ? "UNDEREXPOSED"
        : "OVEREXPOSED";

  return (
    <div className="fs-workspace">
      <section className="fs-main">
        <div className="fs-section-head">
          <div>
            <span className="fs-eyebrow" style={{ color: "var(--fs-red)" }}>Camera test 01</span>
            <h2>Exposure and depth</h2>
          </div>
          <span className="fs-page">{statusLabel}</span>
        </div>

        <CameraMonitor
          topLeft="A CAM · TEST 01"
          topRight={`${reference.label.toUpperCase()} · 25P`}
          bottomItems={[
            `F${aperture}`,
            shutter.label,
            `ISO ${iso}`,
            `EV ${exposure.stops >= 0 ? "+" : ""}${exposure.stops.toFixed(1)}`,
          ]}
        >
          <StudioScene
            brightness={exposure.brightness}
            backgroundBlur={backgroundBlur}
            noise={noise}
            motionBlur={motionBlur}
          />

          {compare && (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  overflow: "hidden",
                  clipPath: "inset(0 50% 0 0)",
                  pointerEvents: "none",
                }}
              >
                <StudioScene
                  brightness={1}
                  backgroundBlur={referenceBlur}
                  noise={referenceNoise}
                  motionBlur={0}
                />
              </div>
              <div style={{ position: "absolute", insetBlock: 0, left: "50%", zIndex: 21, width: 1, background: "white" }} />
              <span className="fs-compare-label" style={{ left: 12 }}>REFERENCE</span>
              <span className="fs-compare-label" style={{ right: 12 }}>CURRENT</span>
            </>
          )}
        </CameraMonitor>

        <ExposureMeter stops={exposure.stops} />

        <div className="fs-buttons" style={{ marginTop: 14 }}>
          <button
            type="button"
            className={`fs-button ${compare ? "is-primary" : ""}`}
            aria-pressed={compare}
            onClick={() => setCompare((value) => !value)}
          >
            <Columns2 size={15} strokeWidth={ICON_STROKE} /> {compare ? "Close comparison" : "Compare reference"}
          </button>
          <button type="button" className="fs-button" onClick={reset}>
            <RotateCcw size={15} strokeWidth={ICON_STROKE} /> Reset test
          </button>
        </div>

        <div className="fs-readouts">
          <Readout label="Exposure" value={`${exposure.stops >= 0 ? "+" : ""}${exposure.stops.toFixed(1)} stops`} />
          <Readout label="Background" value={backgroundBlur > 14 ? "Very soft" : backgroundBlur > 8 ? "Separated" : "More readable"} />
          <Readout label="Noise" value={iso <= 800 ? "Low" : iso <= 3200 ? "Visible" : "Heavy"} />
        </div>
      </section>

      <aside className="fs-sidebar">
        <div className="fs-control">
          <label className="fs-label" htmlFor="fs-preset">Starting situation</label>
          <select
            id="fs-preset"
            className="fs-select"
            value={presetId}
            onChange={(event) => applyPreset(event.target.value as ExposurePresetId)}
            style={{ marginTop: 8 }}
          >
            {Object.entries(EXPOSURE_PRESETS).map(([id, preset]) => (
              <option key={id} value={id}>{preset.label}</option>
            ))}
          </select>
        </div>

        <RangeControl
          icon={<Aperture size={17} strokeWidth={ICON_STROKE} />}
          label="Aperture"
          helper="Light and background separation"
          value={`f/${aperture}`}
          rangeValue={apertureIndex}
          max={APERTURES.length - 1}
          onChange={(value) => {
            setApertureIndex(value);
            setLastChanged("aperture");
          }}
        />

        <RangeControl
          icon={<Timer size={17} strokeWidth={ICON_STROKE} />}
          label="Shutter"
          helper="Exposure and motion rendering"
          value={shutter.label}
          rangeValue={shutterIndex}
          max={SHUTTERS.length - 1}
          onChange={(value) => {
            setShutterIndex(value);
            setLastChanged("shutter");
          }}
        />

        <RangeControl
          icon={<ScanLine size={17} strokeWidth={ICON_STROKE} />}
          label="ISO"
          helper="Exposure and visible noise"
          value={String(iso)}
          rangeValue={isoIndex}
          max={ISO_VALUES.length - 1}
          onChange={(value) => {
            setIsoIndex(value);
            setLastChanged("iso");
          }}
        />

        <RangeControl
          icon={<Sun size={17} strokeWidth={ICON_STROKE} />}
          label="ND filter"
          helper="Cuts light without changing motion or depth"
          value={ndStops === 0 ? "Clear" : `${ndStops} stops`}
          rangeValue={ndIndex}
          max={ND_VALUES.length - 1}
          onChange={(value) => {
            setNdIndex(value);
            setLastChanged("nd");
          }}
        />

        <div style={{ paddingTop: 16 }}>
          <FieldNote title={feedback.title} warning={exposure.status !== "balanced"} live>
            {feedback.copy}
          </FieldNote>
        </div>
      </aside>
    </div>
  );
}

function MovementSimulator() {
  const [kind, setKind] = useState<MoveKind>("dollyIn");
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const move = MOVES[kind];

  useEffect(() => {
    if (!playing) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setPlaying(false);
      return;
    }

    let frame = 0;
    let previous: number | null = null;
    const duration = 3200 / SPEEDS[speedIndex].multiplier;

    const tick = (time: number) => {
      if (previous == null) previous = time;
      const elapsed = time - previous;
      previous = time;

      setProgress((current) => {
        const next = current + elapsed / duration;
        return next >= 1 ? 0 : next;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speedIndex]);

  function reset() {
    setPlaying(false);
    setProgress(0);
  }

  function changeMove(nextMove: MoveKind) {
    setKind(nextMove);
    reset();
  }

  return (
    <div className="fs-workspace">
      <section className="fs-main">
        <div className="fs-section-head">
          <div>
            <span className="fs-eyebrow" style={{ color: "var(--fs-red)" }}>Blocking diagram 02</span>
            <h2>Movement from plan to frame</h2>
          </div>
          <span className="fs-page">{move.abbr}</span>
        </div>

        <div className="fs-diagram-grid">
          <div className="fs-diagram">
            <h3>Floor plan</h3>
            <FloorPlan kind={kind} progress={progress} />
            <div className="fs-progress"><div style={{ width: `${progress * 100}%` }} /></div>
          </div>

          <div className="fs-diagram">
            <h3>What the lens sees</h3>
            <MovementPreview kind={kind} progress={progress} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="fs-label" htmlFor="fs-playback-progress">Playback position</label>
          <input
            id="fs-playback-progress"
            className="fs-range"
            type="range"
            min={0}
            max={100}
            value={Math.round(progress * 100)}
            onChange={(event) => {
              setPlaying(false);
              setProgress(Number(event.target.value) / 100);
            }}
            style={{ marginTop: 9 }}
          />
        </div>

        <div className="fs-buttons" style={{ marginTop: 14 }}>
          <button
            type="button"
            className="fs-button is-primary"
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause size={15} strokeWidth={ICON_STROKE} /> : <Play size={15} strokeWidth={ICON_STROKE} />}
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="fs-button" onClick={reset}>
            <RotateCcw size={15} strokeWidth={ICON_STROKE} /> Reset
          </button>
        </div>
      </section>

      <aside className="fs-sidebar">
        <div className="fs-control">
          <label className="fs-label" htmlFor="fs-move">Camera move</label>
          <select
            id="fs-move"
            className="fs-select"
            value={kind}
            onChange={(event) => changeMove(event.target.value as MoveKind)}
            style={{ marginTop: 8 }}
          >
            {Object.entries(MOVES).map(([id, item]) => (
              <option key={id} value={id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="fs-control">
          <div className="fs-control-head">
            <span className="fs-control-name"><Gauge size={17} strokeWidth={ICON_STROKE} /> Speed</span>
            <span className="fs-value">{SPEEDS[speedIndex].label}</span>
          </div>
          <span className="fs-helper">The camera path stays the same. Only the timing changes.</span>
          <input
            className="fs-range"
            type="range"
            min={0}
            max={SPEEDS.length - 1}
            step={1}
            value={speedIndex}
            onChange={(event) => setSpeedIndex(Number(event.target.value))}
          />
        </div>

        <Detail icon={<Camera size={16} strokeWidth={ICON_STROKE} />} label="Operator does">{move.operator}</Detail>
        <Detail icon={<Eye size={16} strokeWidth={ICON_STROKE} />} label="Viewer feels">{move.feeling}</Detail>
        <Detail icon={<Wrench size={16} strokeWidth={ICON_STROKE} />} label="Equipment">{move.equipment}</Detail>
        <Detail icon={<TriangleAlert size={16} strokeWidth={ICON_STROKE} />} label="Common confusion">{move.confusion}</Detail>

        <div style={{ paddingTop: 16 }}>
          <FieldNote title="Read both views together">
            The floor plan shows the physical camera action. The camera frame shows what that movement does to perspective, parallax and scale.
          </FieldNote>
        </div>
      </aside>
    </div>
  );
}

function CameraMonitor({
  children,
  topLeft,
  topRight,
  bottomItems,
}: {
  children: React.ReactNode;
  topLeft: string;
  topRight: string;
  bottomItems: string[];
}) {
  return (
    <div className="fs-monitor">
      {children}
      <div className="fs-hud fs-hud-top"><span>{topLeft}</span><span>{topRight}</span></div>
      <div className="fs-hud fs-hud-bottom">
        {bottomItems.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function StudioScene({
  brightness = 1,
  backgroundBlur = 0,
  noise = 0,
  motionBlur = 0,
  frame,
}: {
  brightness?: number;
  backgroundBlur?: number;
  noise?: number;
  motionBlur?: number;
  frame?: ReturnType<typeof movementFrame>;
}) {
  const subjectScale = frame?.subjectScale ?? 1;
  const subjectX = frame?.subjectX ?? 0;
  const subjectY = frame?.subjectY ?? 0;
  const backgroundScale = frame?.backgroundScale ?? 1;
  const backgroundX = frame?.backgroundX ?? 0;
  const backgroundY = frame?.backgroundY ?? 0;
  const rotation = frame?.rotation ?? 0;

  return (
    <div
      className="fs-scene"
      style={{
        filter: `brightness(${brightness}) blur(${motionBlur}px)`,
        transform: `rotate(${rotation}deg) scale(${rotation ? 1.02 : 1})`,
      }}
    >
      <div
        className="fs-set"
        style={{
          filter: `blur(${backgroundBlur}px)`,
          transform: `translate(${backgroundX}px, ${backgroundY}px) scale(${backgroundScale + backgroundBlur / 300})`,
        }}
      >
        <div className="fs-wall" />
        <div className="fs-window" />
        <div className="fs-shelf" />
        <div className="fs-practical" />
        <div className="fs-table" />
        <div className="fs-chart">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
      </div>

      <div
        className="fs-subject"
        style={{ transform: `translate(calc(-50% + ${subjectX}px), ${subjectY}px) scale(${subjectScale})` }}
      >
        <SubjectIllustration />
      </div>

      <div className="fs-noise" style={{ opacity: noise }} />
    </div>
  );
}

function SubjectIllustration() {
  return (
    <svg viewBox="0 0 200 310" role="img" aria-label="Neutral subject used for the camera test">
      <path d="M22 305 L35 190 Q53 165 80 160 L120 160 Q147 165 165 190 L178 305 Z" fill="#252a2c" />
      <rect x="83" y="133" width="34" height="47" rx="8" fill="#97634b" />
      <ellipse cx="100" cy="88" rx="43" ry="58" fill="#a77257" />
      <path d="M59 69 Q62 22 99 19 Q139 21 143 66 Q126 46 101 44 Q77 45 59 69 Z" fill="#28221f" />
      <ellipse cx="83" cy="87" rx="4" ry="3" fill="#2c211c" />
      <ellipse cx="117" cy="87" rx="4" ry="3" fill="#2c211c" />
      <path d="M100 91 L97 111 L104 111" fill="none" stroke="#684332" strokeWidth="2" strokeLinecap="round" />
      <path d="M87 125 Q100 132 113 125" fill="none" stroke="#63342e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ExposureMeter({ stops }: { stops: number }) {
  const left = clamp(50 + stops * 16.66, 0, 100);

  return (
    <div className="fs-meter" aria-label={`Exposure meter ${stops >= 0 ? "+" : ""}${stops.toFixed(1)} stops`}>
      <div className="fs-meter-track">
        <span className="fs-meter-zero" />
        <span className="fs-meter-marker" style={{ left: `${left}%` }} />
      </div>
      <div className="fs-meter-labels">
        <span>−3</span><span>−2</span><span>−1</span><span>0</span><span>+1</span><span>+2</span><span>+3</span>
      </div>
    </div>
  );
}

function RangeControl({
  icon,
  label,
  helper,
  value,
  rangeValue,
  max,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  helper: string;
  value: string;
  rangeValue: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = `fs-${label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div className="fs-control">
      <div className="fs-control-head">
        <span className="fs-control-name">{icon}{label}</span>
        <span className="fs-value">{value}</span>
      </div>
      <label className="fs-helper" htmlFor={id}>{helper}</label>
      <input
        id={id}
        className="fs-range"
        type="range"
        min={0}
        max={max}
        step={1}
        value={rangeValue}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="fs-readout">
      <span className="fs-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FieldNote({
  title,
  children,
  warning = false,
  live = false,
}: {
  title: string;
  children: React.ReactNode;
  warning?: boolean;
  live?: boolean;
}) {
  return (
    <aside className={`fs-note ${warning ? "is-warning" : ""}`} aria-live={live ? "polite" : undefined}>
      {warning ? <TriangleAlert size={17} strokeWidth={ICON_STROKE} /> : <Info size={17} strokeWidth={ICON_STROKE} />}
      <div><strong>{title}</strong>{children}</div>
    </aside>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fs-detail">
      <span>{icon}</span>
      <div><strong>{label}</strong>{children}</div>
    </div>
  );
}

function MovementPreview({ kind, progress }: { kind: MoveKind; progress: number }) {
  const frame = movementFrame(kind, progress);

  return (
    <CameraMonitor
      topLeft="A CAM · MOVE TEST"
      topRight={MOVES[kind].abbr}
      bottomItems={["35MM", "25P", "1/50", "PLAYBACK"]}
    >
      <StudioScene frame={frame} motionBlur={frame.motionBlur} />
    </CameraMonitor>
  );
}

function FloorPlan({ kind, progress }: { kind: MoveKind; progress: number }) {
  const camera = cameraPlanPosition(kind, progress);
  const path = getPath(kind);

  return (
    <svg
      className="fs-floorplan"
      viewBox="0 0 320 210"
      role="img"
      aria-label={`Top-down floor plan for ${MOVES[kind].name}`}
    >
      <rect x="1" y="1" width="318" height="208" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="80" y1="1" x2="80" y2="209" stroke="currentColor" strokeOpacity="0.12" />
      <line x1="160" y1="1" x2="160" y2="209" stroke="currentColor" strokeOpacity="0.12" />
      <line x1="240" y1="1" x2="240" y2="209" stroke="currentColor" strokeOpacity="0.12" />
      <line x1="1" y1="70" x2="319" y2="70" stroke="currentColor" strokeOpacity="0.12" />
      <line x1="1" y1="140" x2="319" y2="140" stroke="currentColor" strokeOpacity="0.12" />

      <path d={path} fill="none" stroke="var(--fs-red)" strokeWidth="2.2" strokeDasharray="6 5" />

      <circle cx="160" cy="58" r="12" fill="var(--fs-ink)" />
      <circle cx="160" cy="58" r="23" fill="none" stroke="currentColor" strokeOpacity="0.28" />
      <text x="160" y="28" textAnchor="middle" fill="currentColor" fontSize="10">SUBJECT</text>

      <g transform={`translate(${camera.x * 3.2} ${camera.y * 2.1}) rotate(${camera.angle + 90})`}>
        <rect x="-12" y="-8" width="24" height="16" rx="2" fill="var(--fs-red)" />
        <path d="M12 -5 L22 -10 L22 10 L12 5 Z" fill="var(--fs-red)" />
      </g>
    </svg>
  );
}

function getPath(kind: MoveKind) {
  switch (kind) {
    case "dollyIn": return "M160 178 L160 96";
    case "dollyOut": return "M160 96 L160 178";
    case "truck": return "M78 144 L242 144";
    case "arc": return "M255 105 A100 82 0 1 1 84 88";
    case "handheld": return "M155 157 C170 146 145 134 165 122 C145 110 170 98 157 88";
    case "pan": return "M135 150 A42 42 0 0 1 185 150";
    case "zoom":
    case "static":
    default: return "M160 154 L160 154";
  }
}

function getExposureFeedback({
  status,
  stops,
  lastChanged,
  aperture,
  shutterSeconds,
  iso,
  ndStops,
  reference,
}: {
  status: "under" | "balanced" | "over";
  stops: number;
  lastChanged: ChangedSetting;
  aperture: number;
  shutterSeconds: number;
  iso: number;
  ndStops: number;
  reference: (typeof EXPOSURE_PRESETS)[ExposurePresetId];
}) {
  const effects: string[] = [];

  if (lastChanged === "preset") {
    return {
      title: "Starting point loaded",
      copy: "This preset is a practical baseline. Move one setting at a time and watch the frame, meter and note change together.",
    };
  }

  if (lastChanged === "aperture") {
    effects.push(
      aperture < reference.aperture
        ? "The wider aperture creates shallower depth and stronger background separation."
        : "The smaller aperture keeps more of the set in focus.",
    );
  }

  if (lastChanged === "shutter") {
    effects.push(
      shutterSeconds < reference.shutterSeconds
        ? "The faster shutter makes movement look sharper and more staccato."
        : "The slower shutter creates more visible motion blur.",
    );
  }

  if (lastChanged === "iso") {
    effects.push(
      iso > reference.iso
        ? "The higher ISO lifts the image but adds more visible noise."
        : "The lower ISO gives a cleaner image but reduces exposure.",
    );
  }

  if (lastChanged === "nd") {
    effects.push(
      ndStops > reference.ndStops
        ? "The stronger ND filter cuts incoming light without changing motion blur or depth of field."
        : "Reducing ND allows more light to reach the sensor.",
    );
  }

  if (status === "under") {
    effects.push(`The image is ${Math.abs(stops).toFixed(1)} stops darker than the reference.`);
  } else if (status === "over") {
    effects.push(`The image is ${Math.abs(stops).toFixed(1)} stops brighter than the reference and highlights may clip.`);
  } else {
    effects.push("Exposure remains close to the reference level.");
  }

  return {
    title: status === "balanced" ? "Exposure is balanced" : status === "under" ? "Image is underexposed" : "Image is overexposed",
    copy: effects.join(" "),
  };
}
