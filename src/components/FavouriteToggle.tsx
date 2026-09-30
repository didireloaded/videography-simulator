"use client";

import { useState, useTransition } from "react";
import { cn } from "@/components/ui";
import { Icon } from "@/components/Icon";

type FavouriteItem = { slug: string };

export function FavouriteToggle({
  slug,
  title,
  category,
  accent,
  initialSaved,
}: {
  slug: string;
  title: string;
  category: string;
  accent: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        if (next) {
          await fetch("/api/favourites", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ slug, title, category, accent }),
          });
        } else {
          await fetch(`/api/favourites?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
        }
      } catch {
        setSaved(!next);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-bold transition-all",
        saved ? "border-flare bg-flare/10 text-flare" : "border-line-strong bg-panel text-haze hover:text-chalk"
      )}
    >
      {saved ? (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="bookmark-check" size={16} className="text-flare" />
          <span>Saved in Notebook</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="bookmark" size={16} />
          <span>Bookmark Guide</span>
        </span>
      )}
    </button>
  );
}

export async function fetchFavouriteSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/favourites`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: FavouriteItem[] };
    return data.items.map((i) => i.slug);
  } catch {
    return [];
  }
}
