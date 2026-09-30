"use client";

import React, { type ReactNode } from "react";
import { WorkspaceProvider } from "@/components/WorkspaceContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import { SettingsModal } from "@/components/SettingsModal";
import { AuthModal } from "@/components/AuthModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      {children}
      <OnboardingModal />
      <SettingsModal />
      <AuthModal />
    </WorkspaceProvider>
  );
}
