import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectCrew } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const pId = Number(id);
    const body = await req.json().catch(() => ({}));

    if (!body.name || !body.role || !body.department) {
      return NextResponse.json({ error: "Name, role, and department required" }, { status: 400 });
    }

    const inserted = await db
      .insert(projectCrew)
      .values({
        projectId: pId,
        userId: body.contact === authUser.email ? authUser.id : null,
        name: body.name,
        role: body.role,
        department: body.department,
        contact: body.contact ?? "",
        notes: body.notes ?? "",
      })
      .returning();

    return NextResponse.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/projects/[id]/crew error:", error);
    return NextResponse.json({ error: "Failed to add crew member" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const crewId = req.nextUrl.searchParams.get("crewId");
    if (!crewId) return NextResponse.json({ error: "crewId required" }, { status: 400 });

    const crewMember = (await db.select().from(projectCrew).where(eq(projectCrew.id, Number(crewId))))[0];
    if (!crewMember) return NextResponse.json({ error: "Crew member not found" }, { status: 404 });

    const proj = (await db.select().from(projects).where(eq(projects.id, crewMember.projectId)))[0];
    const isOwner = proj?.ownerUserId === authUser.id;
    const isSelf = crewMember.userId === authUser.id || crewMember.contact === authUser.email;
    const isDeptMatch = crewMember.department === authUser.profile.activeDepartment;

    if (!isOwner && !isSelf && !isDeptMatch && authUser.id !== 1) {
      return NextResponse.json({ error: "Only project owner or department member can remove crew" }, { status: 403 });
    }

    await db.delete(projectCrew).where(eq(projectCrew.id, Number(crewId)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id]/crew error:", error);
    return NextResponse.json({ error: "Failed to delete crew member" }, { status: 500 });
  }
}
