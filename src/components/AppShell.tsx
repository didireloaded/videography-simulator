"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";
import { getDepartment, DEPARTMENTS } from "@/lib/departments";

const tabs: { href: string; label: string; glyph: IconName; no: string }[] = [
  { href: "/", label: "Home", glyph: "home", no: "01" },
  { href: "/learn", label: "Learn", glyph: "learn", no: "02" },
  { href: "/tools", label: "Tools", glyph: "tools", no: "03" },
  { href: "/projects", label: "Projects", glyph: "projects", no: "04" },
  { href: "/saved", label: "Saved", glyph: "saved", no: "05" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, profile, activeDepartment, setActiveDepartment, setSettingsOpen, setAuthModalOpen } = useWorkspace();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const activeDef = getDepartment(activeDepartment);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableIds = Array.from(new Set([profile.primaryDepartment, ...profile.secondaryDepartments]));
  const availableDepts = DEPARTMENTS.filter((d) => availableIds.includes(d.id));

  return (
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-52">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-panel/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-panel/65">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-flare text-[15px] font-bold text-white shadow-sm">F</span>
            <div className="leading-none">
              <div className="cond text-[15px] font-bold tracking-wide text-chalk">
                FrameLab
              </div>
              <div className="text-[10px] font-medium text-haze">On-set workspace</div>
            </div>
          </Link>

          {/* Department Switcher & User Account */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="focus-ring hidden min-h-11 sm:flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs text-haze hover:text-chalk transition-colors"
              title="Switch user account or sign in"
            >
              <Icon name="user-check" size={14} className="text-info" />
              <span className="cond font-bold max-w-[100px] truncate">{user?.name || "Filmmaker"}</span>
            </button>

            <div className="text-right hidden md:block">
              <div className="label-tag !text-[9px] leading-tight text-haze">Current workspace</div>
            </div>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus-ring flex min-h-11 items-center gap-2 rounded-xl bg-ink px-3 py-2 text-xs font-bold text-chalk transition-colors hover:bg-ink-2"
            >
              <Icon name={activeDef.icon} size={15} className="text-flare" />
              <span className="cond text-sm max-w-[130px] truncate sm:max-w-none">{activeDef.name}</span>
              <Icon name="chevron-down" size={13} className="text-haze" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-[20px] border border-line bg-panel/95 p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                <div className="label-tag px-2 py-1 text-[10px] text-haze">Your Departments</div>
                <div className="divide-y divide-line border-y border-line">
                  {availableDepts.map((d) => {
                    const isCurrent = d.id === activeDepartment;
                    const isPrimary = d.id === profile.primaryDepartment;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setActiveDepartment(d.id);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left text-xs transition-colors ${
                          isCurrent ? "bg-flare/10 font-bold text-chalk" : "text-haze hover:bg-ink-2 hover:text-chalk"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon name={d.icon} size={15} className={isCurrent ? "text-flare shrink-0" : "shrink-0"} />
                          <span className="truncate">{d.name}</span>
                        </div>
                        {isPrimary ? (
                          <span className="tech text-[9px] px-1.5 py-0.5 rounded-sm bg-panel border border-line text-haze-2">Primary</span>
                        ) : isCurrent ? (
                          <Icon name="check" size={14} className="text-flare shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="focus-ring flex w-full items-center gap-2 rounded-sm bg-ink-2 px-2.5 py-2 text-left text-xs font-semibold text-chalk hover:bg-ink-2/80"
                >
                  <Icon name="settings" size={14} className="text-flare" />
                  <span>Manage Departments...</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="focus-ring flex w-full items-center gap-2 rounded-sm border-t border-line px-2.5 py-2 text-left text-xs font-semibold text-info hover:bg-info/10 transition-colors"
                >
                  <Icon name="user-check" size={14} />
                  <span>Switch Profile ({user?.name || "Demo"})...</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Desktop binder tabs, left side */}
      <nav className="fixed left-3 top-20 bottom-3 z-30 hidden w-44 flex-col gap-1 rounded-[22px] border border-white/70 bg-panel/72 p-2 shadow-lg backdrop-blur-2xl md:flex">
        {tabs.map((t) => {
          const active = isActive(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "focus-ring relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active ? "text-flare" : "text-haze hover:text-chalk"
              )}
              style={
                active
                  ? { background: "rgba(0,122,255,.12)" }
                  : undefined
              }
            >
              <span className="sr-only">{t.no}</span>
              <Icon name={t.glyph} size={18} className="shrink-0" />
              <span className="cond">{t.label}</span>
            </Link>
          );
        })}
        <div className="mt-auto p-3 border-t border-line space-y-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="focus-ring flex w-full items-center gap-2 rounded-sm bg-panel-2 px-2.5 py-2 text-left text-xs font-semibold text-chalk hover:bg-ink-2 transition-colors border border-line"
          >
            <Icon name="settings" size={14} className="text-flare shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold">{profile.experienceLevel ? profile.experienceLevel.replace("-", " ") : "Profile"}</div>
              <div className="text-[10px] text-haze truncate">Settings &amp; depts</div>
            </div>
          </button>
          <p className="hand text-xs text-haze text-center">keep settled before roll.</p>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>

      {/* Mobile binder index */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-panel/80 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(28,28,30,.08)] backdrop-blur-2xl md:hidden">
        <div className="mx-auto grid min-h-[64px] max-w-md grid-cols-5">
          {tabs.map((t) => {
            const active = isActive(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "focus-ring relative flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                  active ? "text-flare" : "text-chalk/75"
                )}
              >
                <Icon name={t.glyph} size={22} className="shrink-0" />
                <span className="text-[10px] font-semibold leading-none">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
