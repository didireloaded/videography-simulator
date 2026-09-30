"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Panel, Segmented, Tag } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { movements, focalLengths, frameRates } from "@/lib/guides";

const SIZES = ["Extreme Wide", "Wide", "Full", "Medium Wide", "Cowboy", "Medium", "Medium Close-Up", "Close-Up", "Extreme Close-Up", "Establishing", "Insert"];
const ANGLES = ["Eye Level", "High Angle", "Low Angle", "Ground Level", "Bird's-Eye", "Dutch", "Over-the-Shoulder", "POV"];
const SUPPORTS = ["Tripod", "Slider", "Gimbal", "Handheld", "Jib / Crane", "Dolly / Track", "Steadicam", "Monopod", "Drone"];
const AUDIO = ["Lavalier", "Boom", "Shotgun", "Wireless Combo", "On-camera mic", "No audio"];
const LIGHTING = ["Natural", "Soft key + fill", "Three-point", "Low-key", "High-key", "Backlit", "Practicals"];

export default function BuilderPage() {
  const [size, setSize] = useState("Medium Close-Up");
  const [angle, setAngle] = useState("Eye Level");
  const [movement, setMovement] = useState("Dolly In");
  const [lens, setLens] = useState("85mm");
  const [fps, setFps] = useState("25");
  const [support, setSupport] = useState("Tripod and slider");
  const [audio, setAudio] = useState("Lavalier");
  const [lighting, setLighting] = useState("Soft key + fill");
  const [notes, setNotes] = useState("Subject looking camera-right. Negative fill on key side.");
  const [priority, setPriority] = useState("2");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    await fetch("/api/shots", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: `${size} · ${movement}`,
        size, angle, movement, lens, framerate: `${fps} fps`,
        support, audio, lighting, description: notes, priority: Number(priority),
      }),
    });
    setBusy(false);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Shot list"
        title="Build a Shot"
        description="Choose the framing, movement, lens, frame rate, support, sound, and lighting note — then add it to the day’s shot list."
        accent="flare"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel label="FRAMING SETUP" title="Shot Size &amp; Perspective Angle" accent="info">
            <Field label="SHOT SIZE">
              <Select value={size} onChange={setSize} options={SIZES} />
            </Field>
            <Field label="CAMERA ANGLE">
              <Select value={angle} onChange={setAngle} options={ANGLES} />
            </Field>
          </Panel>

          <Panel label="CAMERA & OPTICS" title="Movement, Focal Length &amp; Frame Rate" accent="flare">
            <Field label="CAMERA MOVEMENT">
              <Select value={movement} onChange={setMovement} options={movements.map((m) => m.name)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="FOCAL LENGTH">
                <Select value={lens} onChange={setLens} options={focalLengths.map((f) => f.label)} />
              </Field>
              <Field label="CAPTURE RATE">
                <Select value={fps} onChange={setFps} options={frameRates.map((f) => String(f))} />
              </Field>
            </div>
          </Panel>

          <Panel label="ON-SET DEPARTMENTS" title="Grip Support, Audio Gain &amp; Lighting Plan" accent="amber">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="GRIP SUPPORT"><Select value={support} onChange={setSupport} options={SUPPORTS} /></Field>
              <Field label="SOUND CAPTURE"><Select value={audio} onChange={setAudio} options={AUDIO} /></Field>
              <Field label="LIGHTING PATTERN"><Select value={lighting} onChange={setLighting} options={LIGHTING} /></Field>
            </div>
            <Field label="DIRECTOR / OPERATOR NOTES">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="focus-ring mt-1 w-full rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                placeholder="Direction, eyeline, motivation…"
              />
            </Field>
            <Field label="PRODUCTION PRIORITY">
              <Segmented accent="flare" value={priority} onChange={setPriority} options={[{ value: "1", label: "Optional" }, { value: "2", label: "Normal" }, { value: "3", label: "Must Have" }]} />
            </Field>
          </Panel>
        </div>

        {/* Preview */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Panel label="PREVIEW SHEET" title="Active Shot Card" accent="flare">
            <div className="rounded-sm border-2 border-line-strong bg-panel-2 p-4">
              <div className="mb-3 flex items-center justify-between hairline-b pb-2">
                <span className="cond text-sm font-bold uppercase tracking-wide text-flare flex items-center gap-1.5">
                  <Icon name="list-checks" size={16} />
                  <span>Production Card</span>
                </span>
                <Tag accent="info">{fps} fps</Tag>
              </div>
              <div className="space-y-1.5 text-sm">
                <Row label="SIZE" value={size} />
                <Row label="ANGLE" value={angle} />
                <Row label="MOVE" value={movement} accent="flare" />
                <Row label="LENS" value={lens} accent="info" />
                <Row label="SUPPORT" value={support} />
                <Row label="AUDIO" value={audio} />
                <Row label="LIGHT" value={lighting} accent="amber" />
              </div>
              {notes && <p className="hand mt-3 border-t border-line pt-2 text-base text-haze">{notes}</p>}
            </div>
            <button
              onClick={add}
              disabled={busy}
              className="focus-ring mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-flare px-4 py-3 text-sm font-bold text-panel transition-colors hover:bg-flare-2 disabled:opacity-60"
            >
              <Icon name="list-checks" size={18} />
              <span>{busy ? "Adding…" : "Add to Shot Schedule"}</span>
            </button>
            {saved && (
              <div className="mt-3 flex items-center justify-between rounded-sm border border-ok/40 bg-ok/10 px-3.5 py-2.5 text-xs text-ok font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={16} />
                  <span>Added to production list.</span>
                </span>
                <Link href="/saved" className="inline-flex items-center gap-1 font-bold underline hover:no-underline">
                  <span>Open Report</span>
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="label-tag mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-chalk"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-ink">{o}</option>
      ))}
    </select>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "flare" | "info" | "amber" }) {
  const c = accent === "flare" ? "#a8362a" : accent === "info" ? "#375c7d" : accent === "amber" ? "#a8781f" : "#221d17";
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="label-tag">{label}</span>
      <span className="tech text-right text-xs font-semibold" style={{ color: c }}>{value}</span>
    </div>
  );
}
