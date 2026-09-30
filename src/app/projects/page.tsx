"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Panel, Tag, cn } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";
import { getDepartment, DEPARTMENTS } from "@/lib/departments";

type Project = {
  id: number;
  ownerUserId: number;
  title: string;
  projectType: string;
  description: string | null;
  status: string;
  updatedAt: string;
};

export default function ProjectsIndexPage() {
  const { user, activeDepartment } = useWorkspace();
  const activeDef = getDepartment(activeDepartment);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);

  // New project form state
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState("narrative");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("prep");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a project title.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          projectType,
          description: description.trim(),
          status,
          department: activeDepartment,
          creatorName: user?.name || "Department Lead",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create project.");
      } else {
        setTitle("");
        setDescription("");
        setIsCreating(false);
        await loadProjects();
      }
    } catch (err) {
      setError("Network error creating project.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filterType === "all") return true;
    return p.projectType === filterType;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Mobile-Optimized Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between border-b border-line pb-4">
        <div>
          <div className="label-tag flex items-center gap-1.5" style={{ color: activeDef.color }}>
            <Icon name={activeDef.icon} size={14} />
            <span>Section 04 · {activeDef.name} Workspace</span>
          </div>
          <h1 className="cond mt-1 text-2xl font-bold tracking-tight text-chalk sm:text-3xl">
            Production Binders &amp; Call Sheets
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-haze max-w-2xl leading-relaxed">
            Collaborative film projects. View shared production schedules, scripts, and call sheets while managing your department&apos;s reports and technical diagrams.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="focus-ring inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-sm bg-flare px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-bold text-panel shadow-xs transition-colors hover:bg-flare-2 shrink-0"
        >
          <Icon name={isCreating ? "close" : "plus"} size={16} />
          <span>{isCreating ? "Close Form" : "New Production Binder"}</span>
        </button>
      </div>

      {/* Inline Create Project Form */}
      {isCreating && (
        <Panel label="NEW PRODUCTION ASSIGNMENT" title="Create Collaborative Film Binder" accent="flare" className="border-2 border-chalk bg-panel shadow-md">
          <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
            {error && (
              <div className="flex items-center gap-2 rounded-sm border border-rec/40 bg-rec/10 p-3 text-xs font-semibold text-rec">
                <Icon name="alert" size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="label-tag mb-1 block text-chalk font-semibold">Project / Film Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Midnight Transit — Short Narrative"
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2.5 text-sm text-chalk placeholder:text-haze-2"
                />
              </div>
              <div>
                <label className="label-tag mb-1 block text-chalk font-semibold">Production Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2.5 text-sm text-chalk"
                >
                  <option value="narrative">Narrative Film</option>
                  <option value="commercial">Commercial / Ad</option>
                  <option value="music-video">Music Video</option>
                  <option value="documentary">Documentary</option>
                  <option value="event">Live Event / Concert</option>
                  <option value="social">Social Content</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="label-tag mb-1 block text-chalk font-semibold">Logline / Location Summary</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Late night subway car dialogue confrontation. 3-day shoot."
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
                />
              </div>
              <div>
                <label className="label-tag mb-1 block text-chalk font-semibold">Production Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk font-semibold"
                >
                  <option value="prep">Pre-Production (Prep)</option>
                  <option value="production">Principal Photography (Rolling)</option>
                  <option value="post">Post-Production &amp; Edit</option>
                  <option value="wrapped">Completed / Wrapped</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="focus-ring rounded-sm border border-line-strong px-4 py-2.5 text-xs font-bold text-haze hover:bg-ink-2 hover:text-chalk text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-sm bg-chalk px-6 py-2.5 text-xs font-bold text-panel shadow-xs hover:bg-chalk/90 disabled:opacity-50"
              >
                <Icon name="check" size={16} />
                <span>{submitting ? "Creating Binder..." : "Initialize Production Binder"}</span>
              </button>
            </div>
          </form>
        </Panel>
      )}

      {/* Mobile-Friendly Horizontal Filter Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto w-full py-0.5">
          <FilterButton active={filterType === "all"} onClick={() => setFilterType("all")} label="All Projects" count={projects.length} />
          <FilterButton active={filterType === "narrative"} onClick={() => setFilterType("narrative")} label="Narrative" count={projects.filter(p => p.projectType === "narrative").length} />
          <FilterButton active={filterType === "commercial"} onClick={() => setFilterType("commercial")} label="Commercials" count={projects.filter(p => p.projectType === "commercial").length} />
          <FilterButton active={filterType === "music-video"} onClick={() => setFilterType("music-video")} label="Music Videos" count={projects.filter(p => p.projectType === "music-video").length} />
          <FilterButton active={filterType === "documentary"} onClick={() => setFilterType("documentary")} label="Docs &amp; Events" count={projects.filter(p => ["documentary", "event", "social"].includes(p.projectType)).length} />
        </div>
      </div>

      {/* Project Binders List */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-haze">
          <Icon name="loader" size={20} className="animate-spin text-flare" />
          <span>Opening production archive...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-line py-16 text-center px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line bg-panel-2 text-haze">
            <Icon name="folder" size={24} />
          </div>
          <h3 className="cond text-lg font-bold text-chalk">No Production Binders Found</h3>
          <p className="text-xs sm:text-sm text-haze max-w-md">
            {filterType === "all"
              ? "You haven't initialized any projects yet. Create your first binder above to start sharing scripts, schedules, and department reports."
              : `No projects match the "${filterType}" category.`}
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="focus-ring mt-2 inline-flex items-center gap-2 rounded-sm bg-flare px-4 py-2 text-xs font-bold text-panel hover:bg-flare-2"
          >
            <Icon name="plus" size={15} />
            <span>Create New Binder</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const isMyProject = p.ownerUserId === user?.id;
            const statusColor =
              p.status === "production" ? "#a8362a" : p.status === "prep" ? "#375c7d" : p.status === "post" ? "#a8781f" : "#4c6b43";

            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="focus-ring group flex flex-col justify-between rounded-sm border border-line-strong bg-panel p-5 transition-all hover:border-chalk hover:bg-ink-2/30 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 tech text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-panel-2 border border-line" style={{ color: statusColor }}>
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
                      <span>{p.status === "production" ? "Rolling" : p.status === "prep" ? "Prep" : p.status === "post" ? "Post" : "Wrapped"}</span>
                    </span>
                    <span className="tech text-[10px] text-haze-2 uppercase font-mono">{p.projectType.replace("-", " ")}</span>
                  </div>

                  <div>
                    <h2 className="cond text-lg sm:text-xl font-bold text-chalk group-hover:text-flare transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-haze line-clamp-3 leading-relaxed">
                      {p.description || "No logline provided. Open binder to view schedule and call sheet."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-line flex items-center justify-between text-xs font-bold">
                  <span className="text-haze-2 text-[11px] font-normal flex items-center gap-1">
                    <Icon name="users" size={13} className="text-info" />
                    <span>{isMyProject ? "Lead Binder" : "Collaborative"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-flare group-hover:translate-x-0.5 transition-transform">
                    <span>Open {activeDef.shortName} View</span>
                    <Icon name="arrow-right" size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring shrink-0 inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-semibold transition-colors border whitespace-nowrap min-h-[36px]",
        active
          ? "bg-chalk text-panel border-chalk shadow-xs font-bold"
          : "bg-panel border-line text-haze hover:border-line-strong hover:text-chalk"
      )}
    >
      <span>{label}</span>
      <span className={cn("tech text-[10px] px-1 rounded-sm", active ? "bg-panel/20 text-panel" : "bg-panel-2 text-haze-2")}>
        {count}
      </span>
    </button>
  );
}
