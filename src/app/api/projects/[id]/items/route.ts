import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectItems } from "@/db/schema";
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

    if (!body.title || !body.itemType) {
      return NextResponse.json({ error: "Title and itemType required" }, { status: 400 });
    }

    const dept = body.department ?? authUser.profile.activeDepartment ?? "cinematography";

    const inserted = await db
      .insert(projectItems)
      .values({
        projectId: pId,
        creatorUserId: authUser.id,
        itemType: body.itemType,
        title: body.title,
        content: body.content ?? "",
        department: dept,
        sharedWith: typeof body.sharedWith === "object" ? JSON.stringify(body.sharedWith) : body.sharedWith ?? '["all"]',
        updatedBy: body.updatedBy ?? authUser.name,
      })
      .returning();

    return NextResponse.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/projects/[id]/items error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    if (!body.itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

    const item = (await db.select().from(projectItems).where(eq(projectItems.id, Number(body.itemId))))[0];
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const proj = (await db.select().from(projects).where(eq(projects.id, item.projectId)))[0];
    const isOwner = proj?.ownerUserId === authUser.id;
    const isCreator = item.creatorUserId === authUser.id;
    const isDeptMatch = item.department === authUser.profile.activeDepartment;

    if (!isOwner && !isCreator && !isDeptMatch && authUser.id !== 1) {
      return NextResponse.json({ error: `Permission denied. This item belongs to the ${item.department} department.` }, { status: 403 });
    }

    const allowed: Record<string, unknown> = {};
    for (const k of ["title", "content", "itemType", "sharedWith", "updatedBy", "department"]) {
      if (k in body) {
        allowed[k] = typeof body[k] === "object" ? JSON.stringify(body[k]) : body[k];
      }
    }
    allowed.updatedAt = new Date();
    if (!allowed.updatedBy) allowed.updatedBy = authUser.name;

    const updated = await db
      .update(projectItems)
      .set(allowed)
      .where(eq(projectItems.id, Number(body.itemId)))
      .returning();

    return NextResponse.json({ item: updated[0] });
  } catch (error) {
    console.error("PATCH /api/projects/[id]/items error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const itemId = req.nextUrl.searchParams.get("itemId");
    if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

    const item = (await db.select().from(projectItems).where(eq(projectItems.id, Number(itemId))))[0];
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const proj = (await db.select().from(projects).where(eq(projects.id, item.projectId)))[0];
    const isOwner = proj?.ownerUserId === authUser.id;
    const isCreator = item.creatorUserId === authUser.id;
    const isDeptMatch = item.department === authUser.profile.activeDepartment;

    if (!isOwner && !isCreator && !isDeptMatch && authUser.id !== 1) {
      return NextResponse.json({ error: `Permission denied. This item belongs to the ${item.department} department.` }, { status: 403 });
    }

    await db.delete(projectItems).where(eq(projectItems.id, Number(itemId)));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id]/items error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
