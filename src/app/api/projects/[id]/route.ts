import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectCrew, projectItems } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";
import { canViewSharedItem } from "@/lib/departments";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pId = Number(id);

    const projectRows = await db.select().from(projects).where(eq(projects.id, pId));
    if (!projectRows[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [crew, items] = await Promise.all([
      db.select().from(projectCrew).where(eq(projectCrew.projectId, pId)).orderBy(desc(projectCrew.createdAt)),
      db.select().from(projectItems).where(eq(projectItems.projectId, pId)).orderBy(desc(projectItems.updatedAt)),
    ]);

    const activeDept = authUser.profile.activeDepartment || "cinematography";
    const userCrewDepts = crew.filter((c) => c.userId === authUser.id || c.contact === authUser.email).map((c) => c.department);
    const viewableDepts = new Set([activeDept, ...userCrewDepts]);

    const filteredItems = items.filter((item) => {
      if (item.creatorUserId === authUser.id || projectRows[0].ownerUserId === authUser.id) return true;
      for (const d of viewableDepts) {
        if (canViewSharedItem(item.itemType, item.department, d)) return true;
      }
      return false;
    });

    return NextResponse.json({
      project: projectRows[0],
      crew,
      items: filteredItems,
    });
  } catch (error) {
    console.error(`GET /api/projects/[id] error:`, error);
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pId = Number(id);
    const project = (await db.select().from(projects).where(eq(projects.id, pId)))[0];
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (project.ownerUserId !== authUser.id && authUser.id !== 1) {
      return NextResponse.json({ error: "Only project owner can edit project settings" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    const allowed: Record<string, unknown> = {};
    for (const k of ["title", "projectType", "description", "status"]) {
      if (k in body) allowed[k] = body[k];
    }
    allowed.updatedAt = new Date();

    const updated = await db
      .update(projects)
      .set(allowed)
      .where(eq(projects.id, pId))
      .returning();

    return NextResponse.json({ item: updated[0] });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pId = Number(id);
    const project = (await db.select().from(projects).where(eq(projects.id, pId)))[0];
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (project.ownerUserId !== authUser.id && authUser.id !== 1) {
      return NextResponse.json({ error: "Only project owner can delete project" }, { status: 403 });
    }

    await Promise.all([
      db.delete(projectItems).where(eq(projectItems.projectId, pId)),
      db.delete(projectCrew).where(eq(projectCrew.projectId, pId)),
      db.delete(projects).where(eq(projects.id, pId)),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
