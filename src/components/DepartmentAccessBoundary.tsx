"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/WorkspaceContext";
import { canAccessTopic, findTopic } from "@/lib/content";
import { canAccessTool, findTool } from "@/lib/tools";
import { Icon } from "@/components/Icon";

export function DepartmentAccessBoundary({
  kind,
  slug,
  children,
}: {
  kind: "topic" | "tool";
  slug: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { activeDepartment, isLoading } = useWorkspace();
  const topic = kind === "topic" ? findTopic(slug) : undefined;
  const tool = kind === "tool" ? findTool(slug) : undefined;
  const allowed = kind === "topic"
    ? Boolean(topic && canAccessTopic(topic, activeDepartment))
    : Boolean(tool && canAccessTool(tool, activeDepartment));

  useEffect(() => {
    if (!isLoading && !allowed) router.replace(kind === "topic" ? "/learn" : "/tools");
  }, [allowed, isLoading, kind, router]);

  if (isLoading || !allowed) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center gap-2 text-sm text-haze">
        <Icon name="loader" size={18} className="animate-spin" />
        <span>Opening your department workspace…</span>
      </div>
    );
  }

  return children;
}
