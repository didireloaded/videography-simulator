"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/components/WorkspaceContext";
import { DEPARTMENTS, WORK_TYPES, EXPERIENCE_LEVELS, type DepartmentId } from "@/lib/departments";
import { Icon } from "@/components/Icon";

export function OnboardingModal() {
  const { profile, updateProfile, isLoading } = useWorkspace();
  const [step, setStep] = useState(1);
  const [primary, setPrimary] = useState<DepartmentId>(profile.primaryDepartment || "cinematography");
  const [secondary, setSecondary] = useState<DepartmentId[]>(profile.secondaryDepartments || []);
  const [workTypes, setWorkTypes] = useState<string[]>(profile.workTypes.length > 0 ? profile.workTypes : ["Narrative films"]);
  const [expLevel, setExpLevel] = useState<string>(profile.experienceLevel || "working-professional");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading || profile.completedOnboarding) {
    return null;
  }

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

  async function handleComplete() {
    setIsSubmitting(true);
    await updateProfile({
      primaryDepartment: primary,
      secondaryDepartments: secondary.filter((d) => d !== primary),
      workTypes,
      experienceLevel: expLevel,
      activeDepartment: primary,
      completedOnboarding: true,
    });
    setIsSubmitting(false);
  }

  const primaryDef = DEPARTMENTS.find((d) => d.id === primary)!;
  const secondaryDefs = DEPARTMENTS.filter((d) => secondary.includes(d.id) && d.id !== primary);
  const expDef = EXPERIENCE_LEVELS.find((e) => e.id === expLevel)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chalk/20 p-3 backdrop-blur-xl sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-white/80 bg-panel/95 p-5 shadow-2xl sm:p-8">
        {/* Header / Progress */}
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="label-tag text-flare">First-Time Onboarding · Step {step} of 5</span>
            <h1 className="cond mt-1 text-2xl font-bold text-chalk sm:text-3xl">
              {step === 1 && "What do you do in film?"}
              {step === 2 && "Do you work in other departments?"}
              {step === 3 && "What type of work do you normally create?"}
              {step === 4 && "What is your experience level?"}
              {step === 5 && "Your Production Workspace Summary"}
            </h1>
          </div>
          <div className="tech text-xs font-bold text-haze-2">0{step} / 05</div>
        </div>

        {/* Step 1: Primary Department */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-haze">
              Select your primary filmmaking department. This configures your active field guide, tools, checklists, and document layouts.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
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
                    className={`focus-ring flex flex-col items-start gap-2 rounded-sm border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-flare bg-flare/10 text-chalk shadow-xs"
                        : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-sm border ${isSelected ? "border-flare text-flare bg-panel" : "border-line text-chalk bg-panel"}`}>
                      <Icon name={d.icon} size={18} />
                    </div>
                    <div>
                      <div className="cond font-bold text-sm leading-tight text-chalk">{d.name}</div>
                      <div className="mt-1 text-[11px] text-haze line-clamp-2 leading-normal">{d.blurb}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Optional Secondary Departments */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-haze">
              Select any optional secondary departments you collaborate with or work in. You can switch between them anytime without changing accounts. This step can be skipped.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {DEPARTMENTS.map((d) => {
                if (d.id === primary) return null;
                const isSelected = secondary.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleSecondary(d.id)}
                    className={`focus-ring flex flex-col items-start gap-2 rounded-sm border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-chalk bg-ink-2 text-chalk shadow-xs"
                        : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-line bg-panel text-chalk">
                        <Icon name={d.icon} size={16} />
                      </div>
                      <span className="chk" style={{ borderColor: isSelected ? "var(--color-chalk)" : undefined, background: isSelected ? "var(--color-chalk)" : "transparent" }}>
                        {isSelected && <Icon name="check" size={13} className="text-[#f8f2e6]" />}
                      </span>
                    </div>
                    <div>
                      <div className="cond font-bold text-sm leading-tight text-chalk">{d.name}</div>
                      <div className="mt-1 text-[11px] text-haze line-clamp-2 leading-normal">{d.blurb}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Work Types */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-haze">
              What type of production work do you normally create? You can select multiple options.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {WORK_TYPES.map((wt) => {
                const isSelected = workTypes.includes(wt);
                return (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => toggleWorkType(wt)}
                    className={`focus-ring flex items-center justify-between gap-3 rounded-sm border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-chalk bg-ink-2 text-chalk font-semibold shadow-xs"
                        : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                    }`}
                  >
                    <span className="text-sm">{wt}</span>
                    <span className="chk" style={{ borderColor: isSelected ? "var(--color-chalk)" : undefined, background: isSelected ? "var(--color-chalk)" : "transparent" }}>
                      {isSelected && <Icon name="check" size={13} className="text-[#f8f2e6]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {workTypes.length === 0 && (
              <p className="text-xs text-rec font-semibold">Please select at least one type of work.</p>
            )}
          </div>
        )}

        {/* Step 4: Experience Level */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-haze">
              Select your current industry experience level. This calibrates field note explanations and checklists.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXPERIENCE_LEVELS.map((e) => {
                const isSelected = expLevel === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setExpLevel(e.id)}
                    className={`focus-ring flex flex-col items-start gap-1 rounded-sm border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-flare bg-flare/10 text-chalk shadow-xs"
                        : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="cond font-bold text-base text-chalk">{e.label}</span>
                      <span className="chk rounded-full" style={{ borderColor: isSelected ? "var(--color-flare)" : undefined, background: isSelected ? "var(--color-flare)" : "transparent" }}>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-[#f8f2e6]" />}
                      </span>
                    </div>
                    <span className="text-xs text-haze leading-normal">{e.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 5 && (
          <div className="space-y-5">
            <p className="text-sm text-haze">
              Review your production profile. Your workspace is configured and ready for set use. You can switch departments or edit these settings anytime from your top bar.
            </p>

            <div className="rounded-sm border border-line-strong bg-panel-2 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
                <div>
                  <div className="label-tag text-flare">Primary Department</div>
                  <div className="cond mt-1 flex items-center gap-2 text-lg font-bold text-chalk">
                    <Icon name={primaryDef.icon} size={18} className="text-flare" />
                    <span>{primaryDef.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="label-tag">Document Layout</div>
                  <div className="tech mt-1 text-xs font-semibold text-chalk">{primaryDef.documentStyle}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-b border-line pb-3">
                <div>
                  <div className="label-tag">Secondary Depts</div>
                  <div className="mt-1 text-sm font-medium text-chalk">
                    {secondaryDefs.length > 0 ? (
                      secondaryDefs.map((d) => d.shortName).join(", ")
                    ) : (
                      <span className="text-haze-2 italic">None selected</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="label-tag">Work Types</div>
                  <div className="mt-1 text-sm font-medium text-chalk">
                    {workTypes.length > 0 ? workTypes.join(", ") : "Narrative films"}
                  </div>
                </div>
                <div>
                  <div className="label-tag">Experience Level</div>
                  <div className="mt-1 text-sm font-medium text-chalk capitalize">{expDef.label}</div>
                </div>
              </div>

              <div className="text-xs text-haze flex items-center gap-2">
                <Icon name="info" size={15} className="shrink-0 text-info" />
                <span>Your workspace navigation remains consistent: Home, Learn, Tools, Projects, and Saved. The content inside will now dynamically tailor to {primaryDef.name}.</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-line-strong px-4 py-2 text-xs font-bold text-chalk hover:bg-ink-2"
            >
              <Icon name="arrow-left" size={15} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="focus-ring text-xs font-semibold text-haze hover:text-chalk underline px-2"
              >
                Skip step
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                disabled={step === 3 && workTypes.length === 0}
                onClick={() => setStep((s) => s + 1)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-sm bg-chalk px-5 py-2.5 text-xs font-bold text-panel hover:bg-chalk/90 disabled:opacity-50"
              >
                <span>Continue</span>
                <Icon name="arrow-right" size={15} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleComplete}
                className="focus-ring inline-flex items-center gap-2 rounded-sm bg-flare px-6 py-3 text-sm font-bold text-panel shadow-sm transition-colors hover:bg-flare-2 disabled:opacity-50"
              >
                <Icon name="check" size={18} />
                <span>{isSubmitting ? "Setting up workspace..." : "Open my workspace"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
