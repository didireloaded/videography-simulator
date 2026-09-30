"use client";

import type { ReactNode } from "react";
import type { Accent } from "@/lib/content";
import { accentHex } from "@/lib/content";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ---------------- Panel (notebook sheet) ---------------- */
export function Panel({
  title,
  label,
  accent = "flare",
  right,
  children,
  className,
  bodyClass,
  pageNo,
}: {
  title?: string;
  label?: string;
  accent?: Accent;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClass?: string;
  pageNo?: string;
}) {
  const hex = accentHex[accent];
  return (
    <section className={cn("panel ios-group rounded-sm overflow-hidden", className)}>
      {(title || label || right || pageNo) && (
        <header className="hairline-b flex min-h-12 items-center gap-2.5 px-4 py-3">
          {label && (
            <span className="label-tag" style={{ color: hex }}>
              {label}
            </span>
          )}
          {title && <h2 className="cond text-[15px] font-semibold text-chalk">{title}</h2>}
          <div className="ml-auto flex items-center gap-2">
            {right}
            {pageNo && <span className="page-no">{pageNo}</span>}
          </div>
        </header>
      )}
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

/* ---------------- Tag (stamped label) ---------------- */
export function Tag({
  children,
  accent = "info",
  filled,
}: {
  children: ReactNode;
  accent?: Accent;
  filled?: boolean;
}) {
  const hex = accentHex[accent];
  return (
    <span
      className="tech inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={
        filled
          ? { background: hex, color: "#f8f2e6", border: `1px solid ${hex}` }
          : { color: hex, border: `1px solid ${hex}77` }
      }
    >
      {children}
    </span>
  );
}

/* ---------------- Readout (written camera note) ---------------- */
export function Readout({
  label,
  value,
  accent = "flare",
  sub,
}: {
  label: string;
  value: ReactNode;
  accent?: Accent;
  sub?: string;
}) {
  const hex = accentHex[accent];
  return (
    <div className="inset rounded-sm px-3 py-2">
      <div className="label-tag">{label}</div>
      <div className="tech text-lg font-bold leading-tight" style={{ color: hex }}>
        {value}
      </div>
      {sub && <div className="tech text-[10px] text-haze-2">{sub}</div>}
    </div>
  );
}

/* ---------------- Segmented control (tab selector) ---------------- */
export type SegOption = { value: string; label: string; sub?: string };

export function Segmented({
  options,
  value,
  onChange,
  accent = "flare",
  size = "md",
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
  accent?: Accent;
  size?: "sm" | "md";
}) {
  const hex = accentHex[accent];
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-sm inset p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "focus-ring shrink-0 rounded-full px-3.5 py-2 text-center transition-colors min-h-[36px] flex flex-col justify-center items-center",
              size === "sm" ? "text-[11px]" : "text-xs"
            )}
            style={
              active
                ? { background: "#ffffff", color: hex, boxShadow: "0 1px 3px rgba(0,0,0,.12), 0 0 0 1px rgba(60,60,67,.08)" }
                : { color: "var(--color-haze)" }
            }
          >
            <div className="font-semibold">{o.label}</div>
            {o.sub && <div className="tech text-[9px] opacity-70">{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Slider (physical control strip) ---------------- */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  locked,
  onToggleLock,
  accent = "flare",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
  locked?: boolean;
  onToggleLock?: () => void;
  accent?: Accent;
}) {
  const hex = accentHex[accent];
  const progress = ((value - min) / (max - min || 1)) * 100;
  return (
    <div className={cn("ios-control rounded-sm px-3 py-2.5 inset", locked && "opacity-60")}>
      <div className="mb-2 flex items-center gap-2">
        <span className="label-tag normal-case tracking-normal" style={{ color: locked ? "var(--color-haze)" : hex }}>
          {label}
        </span>
        {onToggleLock && (
          <button
            onClick={onToggleLock}
            title={locked ? "Unlock" : "Lock"}
          className="ml-auto focus-ring rounded-full border px-2.5 py-1 text-[10px] tech transition-colors"
            style={{
              borderColor: locked ? hex : "var(--color-line-strong)",
              color: locked ? hex : "var(--color-haze)",
              background: locked ? hex + "16" : "transparent",
            }}
          >
            {locked ? "LOCKED" : "UNLOCKED"}
          </button>
        )}
        <span className={cn("tech ml-auto text-sm font-bold", onToggleLock && "ml-0")} style={{ color: hex }}>
          {display ?? value}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={display ?? String(value)}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={locked}
        onInput={(e) => onChange(parseFloat(e.currentTarget.value))}
        style={{
          accentColor: hex,
          background: `linear-gradient(90deg, ${hex} 0%, ${hex} ${progress}%, var(--color-panel-3) ${progress}%, var(--color-panel-3) 100%)`,
        }}
      />
    </div>
  );
}

/* ---------------- Toggle (checkbox style) ---------------- */
export function Toggle({
  on,
  onChange,
  label,
  accent = "flare",
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  accent?: Accent;
}) {
  const hex = accentHex[accent];
  return (
    <button
      onClick={() => onChange(!on)}
      className="focus-ring flex items-center gap-2 rounded-sm px-3 py-2 text-xs transition-colors min-h-[36px]"
      style={{
        color: on ? hex : "var(--color-haze)",
        background: on ? hex + "14" : "transparent",
        boxShadow: `inset 0 0 0 1px ${on ? hex + "88" : "var(--color-line-strong)"}`,
      }}
    >
      <span className="chk" style={{ borderColor: on ? hex : undefined, background: on ? hex : "transparent" }}>
        {on && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="#f8f2e6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

/* ---------------- Aperture ring (technical diagram, kept as line art) ---------------- */
export function ApertureRing({
  openness,
  size = 120,
  color = "#a8362a",
  active = true,
}: {
  openness: number;
  size?: number;
  color?: string;
  active?: boolean;
}) {
  const blades = 6;
  const r = size / 2;
  const cx = r;
  const cy = r;
  const hole = r * (0.16 + 0.55 * openness);
  const pts: string[] = [];
  for (let i = 0; i < blades; i++) {
    const a = (Math.PI * 2 * i) / blades - Math.PI / 2;
    const outerR = r * 0.92;
    const x1 = cx + Math.cos(a) * outerR;
    const y1 = cy + Math.sin(a) * outerR;
    pts.push(`${x1},${y1}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={active ? "spin-slow" : ""}>
      <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke={color} strokeOpacity={0.4} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={hole} fill="#18130f" />
      <g>
        {Array.from({ length: blades }).map((_, i) => {
          const a = (Math.PI * 2 * i) / blades - Math.PI / 2;
          const tipR = r * 0.92;
          const tx = cx + Math.cos(a) * tipR;
          const ty = cy + Math.sin(a) * tipR;
          const innerA = a + (Math.PI * 2) / blades;
          const ix = cx + Math.cos(innerA) * hole;
          const iy = cy + Math.sin(innerA) * hole;
          return (
            <polygon
              key={i}
              points={`${tx},${ty} ${ix},${iy} ${cx + Math.cos(a + 0.001) * hole},${cy + Math.sin(a + 0.001) * hole}`}
              fill={color}
              fillOpacity={0.1}
              stroke={color}
              strokeOpacity={0.75}
              strokeWidth={1}
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r={hole} fill="none" stroke="#18130f" strokeWidth={3} />
      <polygon points={pts.join(" ")} fill="none" stroke={color} strokeOpacity={0.3} strokeWidth={1} />
    </svg>
  );
}

/* ---------------- Page header (plain production-document heading) ---------------- */
export function PageHeader({
  kicker,
  title,
  description,
  accent = "flare",
  pageNo,
}: {
  kicker: string;
  title: string;
  description?: string;
  accent?: Accent;
  pageNo?: string;
}) {
  const hex = accentHex[accent];
  return (
    <div className="fadeup border-b border-line pb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="label-tag" style={{ color: hex }}>
          {kicker}
        </div>
        {pageNo && <span className="page-no">{pageNo}</span>}
      </div>
      <h1 className="cond mt-1 text-2xl font-bold tracking-tight text-chalk sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-haze">{description}</p>}
    </div>
  );
}

/* ---------------- Margin note (handwritten annotation, used sparingly) ---------------- */
export function MarginNote({
  kicker = "Remember this",
  children,
  accent = "flare",
}: {
  kicker?: string;
  children: ReactNode;
  accent?: Accent;
}) {
  const hex = accentHex[accent];
  return (
    <div className="relative rounded-sm border border-dashed py-3 pl-4 pr-3" style={{ borderColor: hex + "80" }}>
      <div className="hand text-sm" style={{ color: hex }}>
        {kicker} —
      </div>
      <p className="hand mt-0.5 text-base leading-snug text-chalk/90">{children}</p>
    </div>
  );
}
