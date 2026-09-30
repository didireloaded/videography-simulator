"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader, Panel, Tag, MarginNote, cn } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";
import { useWorkspace } from "@/components/WorkspaceContext";
import { getDepartment, DEPARTMENTS, type DepartmentId } from "@/lib/departments";

type CrewMember = {
  id: number;
  projectId: number;
  userId: number | null;
  name: string;
  role: string;
  department: string;
  contact: string | null;
  notes: string | null;
};

type ProjectItem = {
  id: number;
  projectId: number;
  creatorUserId: number;
  itemType: string;
  title: string;
  content: string | null;
  department: string;
  sharedWith: string;
  updatedBy: string | null;
  updatedAt: string;
};

type ProjectDetail = {
  id: number;
  ownerUserId: number;
  title: string;
  projectType: string;
  description: string | null;
  status: string;
  updatedAt: string;
};

const ITEM_TYPES = [
  { id: "script", label: "Script / Dialogue", icon: "file-text", sharedDefault: "all" },
  { id: "shooting-schedule", label: "Shooting Schedule", icon: "clock", sharedDefault: "all" },
  { id: "call-sheet", label: "Call Sheet / Logistics", icon: "list-checks", sharedDefault: "all" },
  { id: "shot-list", label: "Shot List", icon: "frame", sharedDefault: "directing,cinematography,assistant-directing" },
  { id: "lighting-plan", label: "Lighting Diagram / Plan", icon: "zap", sharedDefault: "cinematography,lighting-grip" },
  { id: "sound-report", label: "Sound Report / Log", icon: "sound", sharedDefault: "sound,editing-post" },
  { id: "camera-report", label: "Camera Report / Mag Sheet", icon: "camera", sharedDefault: "cinematography,script-continuity,editing-post" },
  { id: "continuity-note", label: "Script & Continuity Note", icon: "file-check", sharedDefault: "script-continuity,directing,editing-post" },
  { id: "production-notes", label: "General Dept Note", icon: "folder", sharedDefault: "all" },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  const router = useRouter();
  const { user, activeDepartment } = useWorkspace();
  const activeDef = getDepartment(activeDepartment);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"docs" | "crew" | "settings">("docs");

  // Filter state for docs
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Create Item form state
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("production-notes");
  const [docContent, setDocContent] = useState("");
  const [docShared, setDocShared] = useState("all");
  const [submittingDoc, setSubmittingDoc] = useState(false);
  const [docError, setDocError] = useState("");

  // Add Crew form state
  const [isAddingCrew, setIsAddingCrew] = useState(false);
  const [crewName, setCrewName] = useState("");
  const [crewRole, setCrewRole] = useState("");
  const [crewDept, setCrewDept] = useState<string>(activeDepartment);
  const [crewContact, setCrewContact] = useState("");
  const [crewNotes, setCrewNotes] = useState("");
  const [submittingCrew, setSubmittingCrew] = useState(false);
  const [crewError, setCrewError] = useState("");

  // Edit Project state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editType, setEditType] = useState("");
  const [savingProj, setSavingProj] = useState(false);
  const [projMsg, setProjMsg] = useState("");

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  async function loadProjectData() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("This production binder does not exist or was deleted.");
        } else if (res.status === 401) {
          setError("Please sign in to view this project.");
        } else {
          setError("Failed to load project details.");
        }
      } else {
        const data = await res.json();
        setProject(data.project);
        setCrew(data.crew || []);
        setItems(data.items || []);
        setEditTitle(data.project?.title || "");
        setEditDescription(data.project?.description || "");
        setEditStatus(data.project?.status || "prep");
        setEditType(data.project?.projectType || "narrative");
      }
    } catch (err) {
      setError("Network error loading project.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!docTitle.trim()) {
      setDocError("Please enter a document title.");
      return;
    }
    setSubmittingDoc(true);
    setDocError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitle.trim(),
          itemType: docType,
          content: docContent.trim(),
          department: activeDepartment,
          sharedWith: docShared === "all" ? '["all"]' : JSON.stringify(docShared.split(",").map(s => s.trim())),
          updatedBy: user?.name || "Department Crew",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setDocError(data.error || "Failed to add document.");
      } else {
        setDocTitle("");
        setDocContent("");
        setIsAddingDoc(false);
        await loadProjectData();
      }
    } catch (err) {
      setDocError("Network error adding document.");
    } finally {
      setSubmittingDoc(false);
    }
  }

  async function handleDeleteDoc(itemId: number) {
    if (!confirm("Are you sure you want to remove this report from the production binder?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/items?itemId=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== itemId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete item.");
      }
    } catch (err) {
      alert("Error deleting item.");
    }
  }

  async function handleAddCrew(e: React.FormEvent) {
    e.preventDefault();
    if (!crewName.trim() || !crewRole.trim()) {
      setCrewError("Name and role title are required.");
      return;
    }
    setSubmittingCrew(true);
    setCrewError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/crew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: crewName.trim(),
          role: crewRole.trim(),
          department: crewDept,
          contact: crewContact.trim(),
          notes: crewNotes.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setCrewError(data.error || "Failed to add crew member.");
      } else {
        setCrewName("");
        setCrewRole("");
        setCrewContact("");
        setCrewNotes("");
        setIsAddingCrew(false);
        await loadProjectData();
      }
    } catch (err) {
      setCrewError("Network error adding crew member.");
    } finally {
      setSubmittingCrew(false);
    }
  }

  async function handleDeleteCrew(crewId: number) {
    if (!confirm("Remove this person from the project crew directory?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/crew?crewId=${crewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCrew(crew.filter((c) => c.id !== crewId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove crew member.");
      }
    } catch (err) {
      alert("Error removing crew member.");
    }
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    setSavingProj(true);
    setProjMsg("");
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
          status: editStatus,
          projectType: editType,
        }),
      });
      if (res.ok) {
        setProjMsg("Project binder settings updated.");
        await loadProjectData();
      } else {
        const data = await res.json();
        setProjMsg(data.error || "Failed to save project.");
      }
    } catch (err) {
      setProjMsg("Error saving project.");
    } finally {
      setSavingProj(false);
    }
  }

  async function handleDeleteProject() {
    if (!confirm("CRITICAL: Delete this entire production project and all associated call sheets, schedules, and reports? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/projects");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete project.");
      }
    } catch (err) {
      alert("Error deleting project.");
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-sm text-haze">
        <Icon name="loader" size={24} className="animate-spin text-flare" />
        <span>Retrieving production binder and department reports...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-line py-20 text-center px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line bg-panel-2 text-rec">
          <Icon name="alert" size={24} />
        </div>
        <h2 className="cond text-xl font-bold text-chalk">Unable to Open Production Binder</h2>
        <p className="text-xs sm:text-sm text-haze max-w-md">{error}</p>
        <Link href="/projects" className="focus-ring inline-flex items-center gap-2 rounded-sm bg-chalk px-5 py-2.5 text-xs font-bold text-panel hover:bg-chalk/90">
          <Icon name="arrow-left" size={15} />
          <span>Return to All Binders</span>
        </Link>
      </div>
    );
  }

  const isOwner = project.ownerUserId === user?.id || user?.id === 1;
  const filteredDocs = items.filter((item) => {
    if (deptFilter !== "all" && item.department !== deptFilter) return false;
    if (typeFilter !== "all" && item.itemType !== typeFilter) return false;
    return true;
  });

  const crewByDept = DEPARTMENTS.map((d) => ({
    department: d,
    members: crew.filter((c) => c.department === d.id),
  })).filter((group) => group.members.length > 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back link & Title Header */}
      <div className="space-y-4 border-b border-line pb-5">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold text-haze hover:text-chalk transition-colors">
            <Icon name="arrow-left" size={14} />
            <span>All Production Binders</span>
          </Link>
          <div className="flex items-center gap-2">
            <Tag accent="flare" filled>{project.status.toUpperCase()}</Tag>
            <span className="tech text-xs text-haze font-mono uppercase">{project.projectType.replace("-", " ")}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h1 className="cond text-3xl font-bold tracking-tight text-chalk sm:text-4xl">{project.title}</h1>
            <p className="mt-1 text-xs sm:text-sm text-haze max-w-3xl leading-relaxed">{project.description || "No logline provided."}</p>
          </div>
        </div>

        {/* Active Department Notice Banner */}
        <div className="flex items-center justify-between gap-3 rounded-sm border border-line-strong bg-panel-2 p-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-panel border border-line text-flare">
              <Icon name={activeDef.icon} size={15} />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-chalk">Active Workspace: {activeDef.name}</span>
              <span className="hidden sm:inline text-haze ml-1.5">— You are viewing shared schedules &amp; call sheets, and managing reports assigned to your department.</span>
            </div>
          </div>
          <span className="tech text-[10px] uppercase tracking-wider text-haze-2 shrink-0">Binder ID #{project.id}</span>
        </div>
      </div>

      {/* Mobile-Responsive Navigation Tabs */}
      <div className="flex border-b border-line bg-panel-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("docs")}
          className={`focus-ring cond flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "docs"
              ? "border-b-2 border-flare bg-panel text-chalk shadow-xs"
              : "text-haze hover:text-chalk"
          }`}
        >
          <Icon name="file-text" size={16} className={activeTab === "docs" ? "text-flare" : ""} />
          <span>Production Reports &amp; Call Sheets ({items.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("crew")}
          className={`focus-ring cond flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "crew"
              ? "border-b-2 border-flare bg-panel text-chalk shadow-xs"
              : "text-haze hover:text-chalk"
          }`}
        >
          <Icon name="users" size={16} className={activeTab === "crew" ? "text-flare" : ""} />
          <span>Crew Directory ({crew.length})</span>
        </button>
        {isOwner && (
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`focus-ring cond flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "border-b-2 border-flare bg-panel text-chalk shadow-xs"
                : "text-haze hover:text-chalk"
            }`}
          >
            <Icon name="settings" size={16} className={activeTab === "settings" ? "text-flare" : ""} />
            <span>Binder Settings</span>
          </button>
        )}
      </div>

      {/* TAB 1: PRODUCTION DOCUMENTS & REPORTS */}
      {activeTab === "docs" && (
        <div className="space-y-6">
          {/* Action Bar & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-panel p-3.5 rounded-sm border border-line shadow-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="label-tag text-chalk mr-1 hidden md:inline">Filter By:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="focus-ring rounded-sm border border-line-strong bg-panel-2 px-2.5 py-1.5 text-xs font-semibold text-chalk flex-1 sm:flex-initial"
              >
                <option value="all">All Departments</option>
                <option value={activeDepartment}>My Dept ({activeDef.shortName})</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="focus-ring rounded-sm border border-line-strong bg-panel-2 px-2.5 py-1.5 text-xs font-semibold text-chalk flex-1 sm:flex-initial"
              >
                <option value="all">All Document Types</option>
                {ITEM_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingDoc(!isAddingDoc)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-sm bg-flare px-4 py-2 text-xs font-bold text-panel shadow-xs hover:bg-flare-2 w-full sm:w-auto shrink-0"
            >
              <Icon name={isAddingDoc ? "close" : "plus"} size={15} />
              <span>{isAddingDoc ? "Close Form" : `Add ${activeDef.shortName} Report`}</span>
            </button>
          </div>

          {/* Inline Add Document Form */}
          {isAddingDoc && (
            <Panel label="NEW PRODUCTION REPORT" title={`Add ${activeDef.name} Binder Document`} accent="flare" className="border-2 border-chalk bg-panel shadow-md">
              <form onSubmit={handleCreateDoc} className="space-y-4 pt-2">
                {docError && (
                  <div className="flex items-center gap-2 rounded-sm border border-rec/40 bg-rec/10 p-3 text-xs font-semibold text-rec">
                    <Icon name="alert" size={16} />
                    <span>{docError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="label-tag mb-1 block text-chalk font-semibold">Report / Document Title *</label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g., Day 2 Subway Camera Report / Lighting Plan"
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
                    />
                  </div>
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Document Type</label>
                    <select
                      value={docType}
                      onChange={(e) => {
                        setDocType(e.target.value);
                        const found = ITEM_TYPES.find((t) => t.id === e.target.value);
                        if (found) setDocShared(found.sharedDefault);
                      }}
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
                    >
                      {ITEM_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-tag mb-1 block text-chalk font-semibold">Document Content / Schedule Notes</label>
                  <textarea
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    rows={6}
                    placeholder="Enter call sheet details, schedule timelines, lighting notes, take logs, or technical specs..."
                    className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2.5 text-sm text-chalk placeholder:text-haze-2 font-mono"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="flex items-center gap-2 text-xs text-haze">
                    <Icon name="info" size={14} className="text-info shrink-0" />
                    <span>Owner: <strong>{activeDef.name}</strong> · Shared with: <strong>{docShared === "all" ? "All Departments" : docShared}</strong></span>
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <button type="button" onClick={() => setIsAddingDoc(false)} className="focus-ring rounded-sm border border-line px-4 py-2 text-xs font-bold text-haze hover:text-chalk">Cancel</button>
                    <button type="submit" disabled={submittingDoc} className="focus-ring inline-flex items-center gap-1.5 rounded-sm bg-chalk px-5 py-2 text-xs font-bold text-panel hover:bg-chalk/90 disabled:opacity-50">
                      <Icon name="check" size={15} />
                      <span>{submittingDoc ? "Saving..." : "Add to Binder"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </Panel>
          )}

          {/* Documents List */}
          {filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-line py-16 text-center px-4">
              <Icon name="file-text" size={32} className="text-haze-2" />
              <h3 className="cond text-lg font-bold text-chalk">No Reports in this Section</h3>
              <p className="text-xs sm:text-sm text-haze max-w-md">
                {deptFilter !== "all" || typeFilter !== "all"
                  ? "No documents match your active department or type filters."
                  : "No call sheets, scripts, or department reports have been added to this binder yet."}
              </p>
              <button
                type="button"
                onClick={() => setIsAddingDoc(true)}
                className="focus-ring mt-2 inline-flex items-center gap-2 rounded-sm bg-flare px-4 py-2 text-xs font-bold text-panel hover:bg-flare-2"
              >
                <Icon name="plus" size={15} />
                <span>Add First Document</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((item) => {
                const docDept = getDepartment(item.department);
                const typeInfo = ITEM_TYPES.find((t) => t.id === item.itemType) || ITEM_TYPES[8];
                const canDelete = item.creatorUserId === user?.id || isOwner || item.department === activeDepartment;

                return (
                  <div key={item.id} className="rounded-sm border border-line-strong bg-panel p-5 shadow-xs transition-colors hover:border-chalk">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 tech text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-panel-2 border border-line" style={{ color: docDept.color }}>
                          <Icon name={docDept.icon} size={13} />
                          <span>{docDept.name}</span>
                        </span>
                        <span className="tech text-[10px] font-semibold text-haze uppercase px-2 py-0.5 rounded-sm bg-ink-2">
                          {typeInfo.label}
                        </span>
                        {item.sharedWith.includes("all") ? (
                          <span className="tech text-[9px] text-ok font-bold uppercase">● Shared with All Depts</span>
                        ) : (
                          <span className="tech text-[9px] text-info font-bold uppercase">● Dept Restricted</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-haze">
                        <span>Updated by <strong>{item.updatedBy || "Crew"}</strong></span>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(item.id)}
                            title="Delete Report"
                            className="focus-ring text-haze-2 hover:text-rec p-1 transition-colors"
                          >
                            <Icon name="trash2" size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <h3 className="cond text-lg font-bold text-chalk">{item.title}</h3>
                      {item.content && (
                        <pre className="tech text-xs sm:text-sm text-chalk bg-panel-2 p-3.5 rounded-sm border border-line whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono">
                          {item.content}
                        </pre>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREW DIRECTORY & CONTACTS */}
      {activeTab === "crew" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-panel p-3.5 rounded-sm border border-line shadow-xs">
            <div>
              <h2 className="cond text-lg font-bold text-chalk">Production Crew &amp; Department Directory</h2>
              <p className="text-xs text-haze">All department leads, mixers, operators, and coordinators assigned to this project.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingCrew(!isAddingCrew)}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-sm bg-flare px-4 py-2 text-xs font-bold text-panel shadow-xs hover:bg-flare-2 w-full sm:w-auto shrink-0"
            >
              <Icon name={isAddingCrew ? "close" : "user-plus"} size={15} />
              <span>{isAddingCrew ? "Close Form" : "Add Crew Member"}</span>
            </button>
          </div>

          {/* Inline Add Crew Form */}
          {isAddingCrew && (
            <Panel label="NEW CREW MEMBER" title="Add Person to Production Directory" accent="flare" className="border-2 border-chalk bg-panel shadow-md">
              <form onSubmit={handleAddCrew} className="space-y-4 pt-2">
                {crewError && (
                  <div className="flex items-center gap-2 rounded-sm border border-rec/40 bg-rec/10 p-3 text-xs font-semibold text-rec">
                    <Icon name="alert" size={16} />
                    <span>{crewError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={crewName}
                      onChange={(e) => setCrewName(e.target.value)}
                      placeholder="e.g., Sarah Jenkins"
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                    />
                  </div>
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={crewRole}
                      onChange={(e) => setCrewRole(e.target.value)}
                      placeholder="e.g., 1st Assistant Camera"
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                    />
                  </div>
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Department *</label>
                    <select
                      value={crewDept}
                      onChange={(e) => setCrewDept(e.target.value)}
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Contact Email / Phone</label>
                    <input
                      type="text"
                      value={crewContact}
                      onChange={(e) => setCrewContact(e.target.value)}
                      placeholder="sarah@camera.test / (555) 019-2834"
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                    />
                  </div>
                  <div>
                    <label className="label-tag mb-1 block text-chalk font-semibold">Equipment / Notes</label>
                    <input
                      type="text"
                      value={crewNotes}
                      onChange={(e) => setCrewNotes(e.target.value)}
                      placeholder="e.g., Bringing Teradek RT &amp; SmallHD monitor"
                      className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
                  <button type="button" onClick={() => setIsAddingCrew(false)} className="focus-ring rounded-sm border border-line px-4 py-2 text-xs font-bold text-haze hover:text-chalk">Cancel</button>
                  <button type="submit" disabled={submittingCrew} className="focus-ring inline-flex items-center gap-1.5 rounded-sm bg-chalk px-5 py-2 text-xs font-bold text-panel hover:bg-chalk/90 disabled:opacity-50">
                    <Icon name="check" size={15} />
                    <span>{submittingCrew ? "Adding..." : "Add to Directory"}</span>
                  </button>
                </div>
              </form>
            </Panel>
          )}

          {/* Crew Directory Grouped by Dept */}
          {crewByDept.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-line py-16 text-center px-4">
              <Icon name="users" size={32} className="text-haze-2" />
              <h3 className="cond text-lg font-bold text-chalk">No Crew Assigned Yet</h3>
              <p className="text-xs sm:text-sm text-haze max-w-md">Add department leads and technical operators to start populating your call sheet contacts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {crewByDept.map((group) => (
                <div key={group.department.id} className="rounded-sm border border-line-strong bg-panel overflow-hidden shadow-xs">
                  <div className="hairline-b flex items-center justify-between bg-ink-2/60 px-4 py-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-chalk">
                      <Icon name={group.department.icon} size={16} style={{ color: group.department.color }} />
                      <span>{group.department.name} Department</span>
                    </div>
                    <span className="tech text-xs text-haze font-semibold">{group.members.length} {group.members.length === 1 ? "member" : "members"}</span>
                  </div>

                  <div className="divide-y divide-line">
                    {group.members.map((member) => {
                      const canRemoveCrew = isOwner || member.userId === user?.id || member.department === activeDepartment || user?.id === 1;
                      return (
                        <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-ink-2/30 transition-colors">
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="cond text-base font-bold text-chalk">{member.name}</span>
                              <span className="tech text-xs font-semibold px-2 py-0.5 rounded-sm bg-panel-2 border border-line text-haze">
                                {member.role}
                              </span>
                            </div>
                            {member.notes && <p className="text-xs text-haze line-clamp-1">{member.notes}</p>}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-line">
                            {member.contact ? (
                              <a href={member.contact.includes("@") ? `mailto:${member.contact}` : `tel:${member.contact}`} className="text-info hover:underline font-semibold flex items-center gap-1">
                                <span>{member.contact}</span>
                              </a>
                            ) : (
                              <span className="text-haze-2 italic">No contact</span>
                            )}
                            {canRemoveCrew && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCrew(member.id)}
                                title="Remove Crew Member"
                                className="focus-ring text-haze-2 hover:text-rec p-1"
                              >
                                <Icon name="trash2" size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROJECT SETTINGS */}
      {activeTab === "settings" && isOwner && (
        <Panel label="BINDER GOVERNANCE" title="Production Project Settings" accent="flare" className="max-w-2xl">
          <form onSubmit={handleSaveProject} className="space-y-4 pt-2">
            {projMsg && (
              <div className="flex items-center gap-2 rounded-sm border border-info/40 bg-info/10 p-3 text-xs font-semibold text-info">
                <Icon name="info" size={16} />
                <span>{projMsg}</span>
              </div>
            )}
            <div>
              <label className="label-tag mb-1 block text-chalk font-semibold">Project Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2 text-sm text-chalk"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-tag mb-1 block text-chalk font-semibold">Production Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk"
                >
                  <option value="narrative">Narrative Film</option>
                  <option value="commercial">Commercial / Ad</option>
                  <option value="music-video">Music Video</option>
                  <option value="documentary">Documentary</option>
                  <option value="event">Live Event / Concert</option>
                  <option value="social">Social Content</option>
                </select>
              </div>
              <div>
                <label className="label-tag mb-1 block text-chalk font-semibold">Production Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3 py-2 text-sm text-chalk font-semibold"
                >
                  <option value="prep">Pre-Production (Prep)</option>
                  <option value="production">Principal Photography (Rolling)</option>
                  <option value="post">Post-Production &amp; Edit</option>
                  <option value="wrapped">Completed / Wrapped</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label-tag mb-1 block text-chalk font-semibold">Logline / Description</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel-2 px-3.5 py-2 text-sm text-chalk"
              />
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <button
                type="button"
                onClick={handleDeleteProject}
                className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-rec/40 px-4 py-2 text-xs font-bold text-rec hover:bg-rec/10 transition-colors"
              >
                <Icon name="trash2" size={14} />
                <span>Delete Production Binder</span>
              </button>
              <button
                type="submit"
                disabled={savingProj}
                className="focus-ring inline-flex items-center gap-1.5 rounded-sm bg-chalk px-6 py-2.5 text-xs font-bold text-panel hover:bg-chalk/90 disabled:opacity-50"
              >
                <Icon name="check" size={15} />
                <span>{savingProj ? "Saving..." : "Save Binder Settings"}</span>
              </button>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
