"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/components/WorkspaceContext";
import { DEPARTMENTS, WORK_TYPES, EXPERIENCE_LEVELS, type DepartmentId } from "@/lib/departments";
import { Icon } from "@/components/Icon";

export function SettingsModal() {
  const { profile, updateProfile, isSettingsOpen, setSettingsOpen } = useWorkspace();
  const [primary, setPrimary] = useState<DepartmentId>(profile.primaryDepartment || "cinematography");
  const [secondary, setSecondary] = useState<DepartmentId[]>(profile.secondaryDepartments || []);
  const [workTypes, setWorkTypes] = useState<string[]>(profile.workTypes || ["Narrative films"]);
  const [expLevel, setExpLevel] = useState<string>(profile.experienceLevel || "working-professional");
  const [activeTab, setActiveTab] = useState<"depts" | "profile">("depts");
  const [isSaving, setIsSaving] = useState(false);

  if (!isSettingsOpen) return null;

  function toggleSecondary(id: DepartmentId) {
    if (id === primary) return;
    setSecondary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function toggleWorkType(wt: string) {
    setWorkTypes((prev) =>
      prev.includes(wt) ? prev.filter((t) => t !== wt) : [...prev, wt]
    );
  }

  async function handleSave() {
    setIsSaving(true);
    const newSecondary = secondary.filter((d) => d !== primary);
    const isCurrentActiveInList = [primary, ...newSecondary].includes(profile.activeDepartment);
    const newActive = isCurrentActiveInList ? profile.activeDepartment : primary;

    await updateProfile({
      primaryDepartment: primary,
      secondaryDepartments: newSecondary,
      workTypes,
      experienceLevel: expLevel,
      activeDepartment: newActive,
    });
    setIsSaving(false);
    setSettingsOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chalk/20 p-3 backdrop-blur-xl sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-white/80 bg-panel/95 p-5 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="label-tag text-flare">Production Profile &amp; Settings</span>
            <h2 className="cond mt-1 text-2xl font-bold text-chalk">Manage Departments &amp; Experience</h2>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="focus-ring rounded-sm border border-line p-1 text-haze hover:text-chalk hover:border-line-strong"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-line bg-panel-2">
          <button
            type="button"
            onClick={() => setActiveTab("depts")}
            className={`cond px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "depts"
                ? "border-b-2 border-flare bg-panel text-chalk"
                : "text-haze hover:text-chalk"
            }`}
          >
            Departments Workspace
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`cond px-5 py-2.5 text-sm font-bold transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-flare bg-panel text-chalk"
                : "text-haze hover:text-chalk"
            }`}
          >
            Work Types &amp; Experience
          </button>
        </div>

        {activeTab === "depts" ? (
          <div className="space-y-6">
            <div>
              <div className="label-tag mb-2 text-flare">1. Primary Department</div>
              <p className="text-xs text-haze mb-3">Your default department when you open the field notebook.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {DEPARTMENTS.map((d) => {
                  const isSelected = primary === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setPrimary(d.id);
                        if (secondary.includes(d.id)) {
                          setSecondary(secondary.filter((x) => x !== d.id));
                        }
                      }}
                      className={`focus-ring flex items-center gap-2.5 rounded-sm border p-3 text-left transition-colors ${
                        isSelected
                          ? "border-flare bg-flare/10 text-chalk font-bold shadow-xs"
                          : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                      }`}
                    >
                      <Icon name={d.icon} size={16} className={isSelected ? "text-flare" : ""} />
                      <span className="text-xs">{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="label-tag mb-2 text-info">2. Optional Secondary Departments</div>
              <p className="text-xs text-haze mb-3">Add any additional departments you work in. You can switch between them anytime from the top bar.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {DEPARTMENTS.map((d) => {
                  if (d.id === primary) return null;
                  const isSelected = secondary.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleSecondary(d.id)}
                      className={`focus-ring flex items-center justify-between gap-2 rounded-sm border p-3 text-left transition-colors ${
                        isSelected
                          ? "border-chalk bg-ink-2 text-chalk font-semibold shadow-xs"
                          : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name={d.icon} size={16} className="shrink-0" />
                        <span className="text-xs truncate">{d.name}</span>
                      </div>
                      <span className="chk shrink-0" style={{ borderColor: isSelected ? "var(--color-chalk)" : undefined, background: isSelected ? "var(--color-chalk)" : "transparent" }}>
                        {isSelected && <Icon name="check" size={13} className="text-[#f8f2e6]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="label-tag mb-2">Work Types</div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {WORK_TYPES.map((wt) => {
                  const isSelected = workTypes.includes(wt);
                  return (
                    <button
                      key={wt}
                      type="button"
                      onClick={() => toggleWorkType(wt)}
                      className={`focus-ring flex items-center justify-between gap-2 rounded-sm border p-3 text-left transition-colors ${
                        isSelected
                          ? "border-chalk bg-ink-2 text-chalk font-semibold shadow-xs"
                          : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                      }`}
                    >
                      <span className="text-xs">{wt}</span>
                      <span className="chk shrink-0" style={{ borderColor: isSelected ? "var(--color-chalk)" : undefined, background: isSelected ? "var(--color-chalk)" : "transparent" }}>
                        {isSelected && <Icon name="check" size={13} className="text-[#f8f2e6]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-line pt-5">
              <div className="label-tag mb-2">Experience Level</div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {EXPERIENCE_LEVELS.map((e) => {
                  const isSelected = expLevel === e.id;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setExpLevel(e.id)}
                      className={`focus-ring flex items-center justify-between gap-3 rounded-sm border p-3.5 text-left transition-colors ${
                        isSelected
                          ? "border-flare bg-flare/10 text-chalk font-bold shadow-xs"
                          : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                      }`}
                    >
                      <div>
                        <div className="text-xs">{e.label}</div>
                        <div className="text-[10px] text-haze font-normal mt-0.5">{e.desc}</div>
                      </div>
                      <span className="chk rounded-full shrink-0" style={{ borderColor: isSelected ? "var(--color-flare)" : undefined, background: isSelected ? "var(--color-flare)" : "transparent" }}>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-[#f8f2e6]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="focus-ring rounded-sm border border-line-strong px-4 py-2 text-xs font-bold text-chalk hover:bg-ink-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving || workTypes.length === 0}
            onClick={handleSave}
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm bg-flare px-6 py-2 text-xs font-bold text-panel shadow-sm hover:bg-flare-2 disabled:opacity-50"
          >
            <Icon name="check" size={16} />
            <span>{isSaving ? "Saving..." : "Save Workspace Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
