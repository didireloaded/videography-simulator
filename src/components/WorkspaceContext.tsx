"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type DepartmentId, getDepartment } from "@/lib/departments";

export type UserProfile = {
  id: number;
  primaryDepartment: DepartmentId;
  secondaryDepartments: DepartmentId[]; // parsed from JSON
  workTypes: string[]; // parsed from JSON
  experienceLevel: string;
  activeDepartment: DepartmentId;
  completedOnboarding: boolean;
};

export type UserAccount = {
  id: number;
  name: string;
  email: string;
  roleTitle: string;
};

export type DemoUser = {
  id: number;
  name: string;
  email: string;
  roleTitle: string;
  primaryDepartment: string;
};

type WorkspaceContextType = {
  user: UserAccount;
  demoUsers: DemoUser[];
  profile: UserProfile;
  activeDepartment: DepartmentId;
  setActiveDepartment: (id: DepartmentId) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  switchUser: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  availableDepartments: DepartmentId[];
};

const defaultUser: UserAccount = {
  id: 1,
  name: "Marcus Thorne",
  email: "marcus@framelab.test",
  roleTitle: "Director of Photography",
};

const defaultProfile: UserProfile = {
  id: 1,
  primaryDepartment: "cinematography",
  secondaryDepartments: [],
  workTypes: ["Narrative films"],
  experienceLevel: "working-professional",
  activeDepartment: "cinematography",
  completedOnboarding: false,
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  user: defaultUser,
  demoUsers: [],
  profile: defaultProfile,
  activeDepartment: "cinematography",
  setActiveDepartment: async () => {},
  updateProfile: async () => {},
  switchUser: async () => {},
  logout: async () => {},
  isLoading: true,
  isSettingsOpen: false,
  setSettingsOpen: () => {},
  isAuthModalOpen: false,
  setAuthModalOpen: () => {},
  availableDepartments: ["cinematography"],
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount>(defaultUser);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activeDepartment, setActiveDepartmentState] = useState<DepartmentId>("cinematography");
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [authRes, profRes] = await Promise.all([
        fetch("/api/auth"),
        fetch("/api/profile"),
      ]);
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.user) {
          setUser({
            id: authData.user.id,
            name: authData.user.name,
            email: authData.user.email,
            roleTitle: authData.user.roleTitle,
          });
        }
        if (authData.demoUsers) setDemoUsers(authData.demoUsers);
      }
      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.profile) {
          const parsed: UserProfile = {
            id: profData.profile.id,
            primaryDepartment: (profData.profile.primaryDepartment || "cinematography") as DepartmentId,
            secondaryDepartments: parseJsonArray(profData.profile.secondaryDepartments) as DepartmentId[],
            workTypes: parseJsonArray(profData.profile.workTypes),
            experienceLevel: profData.profile.experienceLevel || "working-professional",
            activeDepartment: (profData.profile.activeDepartment || profData.profile.primaryDepartment || "cinematography") as DepartmentId,
            completedOnboarding: Boolean(profData.profile.completedOnboarding),
          };
          setProfile(parsed);
          setActiveDepartmentState(parsed.activeDepartment);
        }
        if (profData.user) {
          setUser(profData.user);
        }
      }
    } catch (err) {
      console.error("Failed to load user session:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function switchUser(userId: number) {
    setIsLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "switch", userId }),
      });
      await loadAll();
    } catch (err) {
      console.error("Failed to switch user:", err);
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      await loadAll();
    } catch (err) {
      console.error("Failed to logout:", err);
      setIsLoading(false);
    }
  }

  async function setActiveDepartment(id: DepartmentId) {
    setActiveDepartmentState(id);
    setProfile((prev) => ({ ...prev, activeDepartment: id }));
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeDepartment: id }),
      });
    } catch (err) {
      console.error("Failed to save active department:", err);
    }
  }

  async function updateProfile(data: Partial<UserProfile>) {
    const updated = { ...profile, ...data };
    setProfile(updated);
    if (data.activeDepartment) {
      setActiveDepartmentState(data.activeDepartment);
    }
    try {
      const payload: Record<string, unknown> = {};
      if (data.primaryDepartment !== undefined) payload.primaryDepartment = data.primaryDepartment;
      if (data.secondaryDepartments !== undefined) payload.secondaryDepartments = data.secondaryDepartments;
      if (data.workTypes !== undefined) payload.workTypes = data.workTypes;
      if (data.experienceLevel !== undefined) payload.experienceLevel = data.experienceLevel;
      if (data.activeDepartment !== undefined) payload.activeDepartment = data.activeDepartment;
      if (data.completedOnboarding !== undefined) payload.completedOnboarding = data.completedOnboarding;

      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  }

  const availableDepartments = Array.from(new Set([profile.primaryDepartment, ...profile.secondaryDepartments]));

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        demoUsers,
        profile,
        activeDepartment,
        setActiveDepartment,
        updateProfile,
        switchUser,
        logout,
        isLoading,
        isSettingsOpen,
        setSettingsOpen,
        isAuthModalOpen,
        setAuthModalOpen,
        availableDepartments,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
  }
  return [];
}
