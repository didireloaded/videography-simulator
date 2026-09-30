"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Panel, Tag, cn } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";

type Fav = { id: number; slug: string; title: string; category: string; accent: string };
type Shot = {
  id: number; title: string | null; size: string | null; angle: string | null;
  movement: string | null; lens: string | null; framerate: string | null; support: string | null;
  audio: string | null; lighting: string | null; description: string | null;
  priority: number; completed: boolean; position: number;
};

const ACCENTS = ["flare", "info", "ok", "amber", "rec"] as const;

export default function SavedPage() {
  const { activeDepartment } = useWorkspace();
  const [favs, setFavs] = useState<Fav[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [f, s] = await Promise.all([fetch("/api/favourites"), fetch("/api/shots")]);
    const fj = await f.json();
    const sj = await s.json();
    setFavs(fj.items ?? []);
    setShots(sj.items ?? []);
    setLoading(false);
  }, [activeDepartment]);

  useEffect(() => {
    load();
  }, [load]);

  async function removeFav(slug: string) {
    setFavs((x) => x.filter((f) => f.slug !== slug));
    await fetch(`/api/favourites?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
  }

  async function toggleShot(id: number, completed: boolean) {
    setShots((x) => x.map((s) => (s.id === id ? { ...s, completed } : s)));
    await fetch(`/api/shots/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ completed }) });
  }

  async function removeShot(id: number) {
    setShots((x) => x.filter((s) => s.id !== id));
    await fetch(`/api/shots/${id}`, { method: "DELETE" });
  }

  async function moveShot(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= shots.length) return;
    const a = shots[index];
    const b = shots[target];
    const next = [...shots];
    next[index] = b;
    next[target] = a;
    setShots(next);
    await Promise.all([
      fetch(`/api/shots/${a.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ position: b.position }) }),
      fetch(`/api/shots/${b.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ position: a.position }) }),
    ]);
  }

  const done = shots.filter((s) => s.completed).length;

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Production folder"
        title="Saved Notes & Shot List"
        description="Your marked reference sheets and the working shot list for the day."
        accent="flare"
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-haze py-12">
          <Icon name="loader" size={18} className="animate-spin" />
          <span>Opening field notes…</span>
        </div>
      ) : (
        <>
          {/* Shot list */}
          <Panel
            label="CAMERA REPORT & SHOT LIST"
            title={`Shot Schedule — ${done} of ${shots.length} completed`}
            accent="flare"
            right={
              <button
                onClick={() => window.print()}
                className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-line-strong px-3 py-1.5 text-xs font-semibold text-chalk transition-colors hover:bg-ink-2"
              >
                <Icon name="printer" size={15} />
                <span>Print / Export PDF</span>
              </button>
            }
          >
            {shots.length === 0 ? (
              <Empty icon="list-checks" text="Your digital camera report is currently empty." cta={{ href: "/builder", label: "Open Shot Builder" }} />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-haze sm:hidden px-1">
                  <span className="inline-flex items-center gap-1 text-flare">
                    <Icon name="arrow-left" size={12} />
                    <span>Swipe table horizontally</span>
                    <Icon name="arrow-right" size={12} />
                  </span>
                  <span>{shots.length} total</span>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="hairline-b text-left">
                      <th className="label-tag px-2.5 py-2 font-semibold">Shot</th>
                      <th className="label-tag px-2.5 py-2 font-semibold">Size &amp; Notes</th>
                      <th className="label-tag px-2.5 py-2 font-semibold">Lens</th>
                      <th className="label-tag px-2.5 py-2 font-semibold">Movement</th>
                      <th className="label-tag px-2.5 py-2 font-semibold">FPS</th>
                      <th className="label-tag px-2.5 py-2 font-semibold">Priority</th>
                      <th className="label-tag px-2.5 py-2 text-center font-semibold">Done</th>
                      <th className="label-tag px-2.5 py-2 font-semibold text-right">Order / Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shots.map((s, i) => (
                      <tr key={s.id} className={cn("hairline-b align-top transition-colors", s.completed && "bg-ok/10")}>
                        <td className="tech px-2.5 py-3 text-xs font-semibold text-haze">{String(i + 1).padStart(2, "0")}</td>
                        <td className={cn("px-2.5 py-3 font-medium", s.completed ? "text-haze line-through" : "text-chalk")}>
                          <div className="font-bold">{s.size || "—"}</div>
                          {s.description && <div className="hand mt-1 max-w-[240px] text-[14px] leading-snug text-haze">{s.description}</div>}
                        </td>
                        <td className="tech px-2.5 py-3 text-xs font-semibold text-chalk">{s.lens || "—"}</td>
                        <td className="tech px-2.5 py-3 text-xs font-semibold text-chalk">{s.movement || "—"}</td>
                        <td className="tech px-2.5 py-3 text-xs font-semibold text-chalk">{s.framerate || "—"}</td>
                        <td className="px-2.5 py-3">
                          {s.priority >= 3 ? (
                            <Tag accent="rec">Must have</Tag>
                          ) : s.priority <= 1 ? (
                            <Tag accent="info">Optional</Tag>
                          ) : (
                            <Tag accent="amber">Normal</Tag>
                          )}
                        </td>
                        <td className="px-2.5 py-3 text-center">
                          <button
                            onClick={() => toggleShot(s.id, !s.completed)}
                            title="Mark completed"
                            className="focus-ring chk mx-auto transition-colors"
                            style={{ borderColor: s.completed ? "#4c6b43" : undefined, background: s.completed ? "#4c6b43" : "transparent" }}
                          >
                            {s.completed && <Icon name="check" size={14} className="text-[#f8f2e6]" />}
                          </button>
                        </td>
                        <td className="px-2.5 py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => moveShot(i, -1)} title="Move Up" className="focus-ring rounded-sm border border-line p-1.5 text-haze transition-colors hover:text-chalk hover:bg-ink-2">
                              <Icon name="chevron-up" size={14} />
                            </button>
                            <button onClick={() => moveShot(i, 1)} title="Move Down" className="focus-ring rounded-sm border border-line p-1.5 text-haze transition-colors hover:text-chalk hover:bg-ink-2">
                              <Icon name="chevron-down" size={14} />
                            </button>
                            <button onClick={() => removeShot(s.id)} title="Delete Shot" className="focus-ring rounded-sm border border-rec/40 p-1.5 text-rec/80 transition-colors hover:text-rec hover:bg-rec/10">
                              <Icon name="close" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </Panel>

          {/* Favourites */}
          <Panel label="BOOKMARKS & REFERENCE" title={`Bookmarked Field Guides — ${favs.length}`} accent="info">
            {favs.length === 0 ? (
              <Empty icon="bookmark" text="No bookmarks in your notebook yet." cta={{ href: "/learn", label: "Browse Field Guide" }} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favs.map((f) => {
                  const accent = (ACCENTS.includes(f.accent as (typeof ACCENTS)[number]) ? f.accent : "flare") as (typeof ACCENTS)[number];
                  const internal = !f.slug.startsWith("tool-");
                  return (
                    <div key={f.id} className="flex items-center justify-between gap-3 rounded-sm border border-line-strong bg-panel p-3.5 transition-colors hover:bg-ink-2/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <Tag accent={accent}>{f.category.slice(0, 3).toUpperCase()}</Tag>
                        <span className="truncate text-sm font-semibold text-chalk">{f.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {internal && (
                          <Link href={`/learn/${f.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-flare hover:underline">
                            <span>Open</span>
                            <Icon name="arrow-right" size={14} />
                          </Link>
                        )}
                        <button onClick={() => removeFav(f.slug)} title="Remove Bookmark" className="focus-ring text-haze-2 transition-colors hover:text-rec p-1">
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}

function Empty({ icon, text, cta }: { icon: IconName; text: string; cta: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-line py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line bg-panel-2 text-haze">
        <Icon name={icon} size={24} />
      </div>
      <p className="text-sm text-haze font-medium max-w-sm">{text}</p>
      <Link href={cta.href} className="focus-ring mt-1 inline-flex items-center gap-2 rounded-sm border border-flare/40 bg-flare/10 px-4 py-2 text-xs font-bold text-flare transition-colors hover:bg-flare/20">
        <span>{cta.label}</span>
        <Icon name="arrow-right" size={14} />
      </Link>
    </div>
  );
}
