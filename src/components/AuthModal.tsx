"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/components/WorkspaceContext";
import { Icon } from "@/components/Icon";
import { DEPARTMENTS } from "@/lib/departments";

export function AuthModal() {
  const { user, demoUsers, switchUser, isAuthModalOpen, setAuthModalOpen } = useWorkspace();
  const [tab, setTab] = useState<"switch" | "login" | "signup">("switch");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("Filmmaker");
  const [dept, setDept] = useState("cinematography");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  async function handleSwitch(userId: number) {
    setLoading(true);
    setError("");
    try {
      await switchUser(userId);
      setAuthModalOpen(false);
    } catch (err) {
      setError("Failed to switch account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: tab,
          email,
          password,
          name,
          roleTitle,
          department: dept,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
      } else {
        await switchUser(data.userId);
        setAuthModalOpen(false);
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chalk/20 p-3 backdrop-blur-xl sm:p-6">
      <div className="w-full max-w-lg rounded-[24px] border border-white/80 bg-panel/95 p-5 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="label-tag text-flare">Account &amp; Workspace Authentication</span>
            <h2 className="cond mt-1 text-2xl font-bold text-chalk">Active Filmmaker Profile</h2>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            className="focus-ring rounded-sm border border-line p-1 text-haze hover:text-chalk"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-line bg-panel-2">
          <button
            type="button"
            onClick={() => { setTab("switch"); setError(""); }}
            className={`cond flex-1 py-2 text-center text-sm font-bold transition-colors ${
              tab === "switch" ? "border-b-2 border-flare bg-panel text-chalk" : "text-haze hover:text-chalk"
            }`}
          >
            Demo Profiles
          </button>
          <button
            type="button"
            onClick={() => { setTab("login"); setError(""); }}
            className={`cond flex-1 py-2 text-center text-sm font-bold transition-colors ${
              tab === "login" ? "border-b-2 border-flare bg-panel text-chalk" : "text-haze hover:text-chalk"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setError(""); }}
            className={`cond flex-1 py-2 text-center text-sm font-bold transition-colors ${
              tab === "signup" ? "border-b-2 border-flare bg-panel text-chalk" : "text-haze hover:text-chalk"
            }`}
          >
            New Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-sm border border-rec/40 bg-rec/10 p-3 text-xs font-semibold text-rec flex items-center gap-2">
            <Icon name="alert" size={16} />
            <span>{error}</span>
          </div>
        )}

        {tab === "switch" && (
          <div className="space-y-4">
            <p className="text-xs text-haze">
              Switch immediately between pre-configured industry profiles to explore how the workspace transforms across film departments.
            </p>
            <div className="space-y-2.5">
              {demoUsers.map((u) => {
                const isCurrent = u.id === user.id;
                const deptDef = DEPARTMENTS.find((d) => d.id === u.primaryDepartment) || DEPARTMENTS[0];
                return (
                  <button
                    key={u.id}
                    type="button"
                    disabled={loading || isCurrent}
                    onClick={() => handleSwitch(u.id)}
                    className={`focus-ring flex w-full items-center justify-between gap-3 rounded-sm border p-3.5 text-left transition-colors ${
                      isCurrent
                        ? "border-flare bg-flare/10 text-chalk shadow-xs"
                        : "border-line bg-panel-2 text-haze hover:border-line-strong hover:text-chalk"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-panel text-chalk">
                        <Icon name={deptDef.icon} size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="cond font-bold text-base text-chalk">{u.name}</span>
                          {isCurrent && (
                            <span className="tech text-[9px] px-1.5 py-0.5 rounded-sm bg-flare text-panel">Current</span>
                          )}
                        </div>
                        <div className="text-xs text-haze truncate">{u.roleTitle} · <span className="text-chalk font-semibold">{deptDef.name}</span></div>
                      </div>
                    </div>
                    {!isCurrent && (
                      <span className="tech text-xs font-bold text-flare shrink-0">Switch →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "login" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-tag mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@framelab.test"
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
              />
            </div>
            <div>
              <label className="label-tag mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
              />
              <span className="text-[11px] text-haze mt-1 block">Tip: All demo accounts use password <strong>demo123</strong>.</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-sm bg-chalk px-4 py-2.5 text-xs font-bold text-panel hover:bg-chalk/90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In to Workspace"}
            </button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-tag mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Reyes"
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-tag mb-1 block">Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Gaffer / Lead Editor"
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-chalk placeholder:text-haze-2"
                />
              </div>
              <div>
                <label className="label-tag mb-1 block">Primary Dept</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-chalk"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label-tag mb-1 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@framelab.test"
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3.5 py-2 text-sm text-chalk placeholder:text-haze-2"
              />
            </div>
            <div>
              <label className="label-tag mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-ring w-full rounded-sm border border-line-strong bg-panel px-3.5 py-2 text-sm text-chalk"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-sm bg-flare px-4 py-2.5 text-xs font-bold text-panel hover:bg-flare-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Filmmaker Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
