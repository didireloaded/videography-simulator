import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shots } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const allowed: Record<string, unknown> = {};
  for (const k of [
    "title","size","angle","movement","lens","framerate","support",
    "audio","lighting","description","priority","completed","position",
  ]) {
    if (k in body) allowed[k] = body[k];
  }
  allowed.updatedAt = new Date();
  const updated = await db
    .update(shots)
    .set(allowed)
    .where(and(eq(shots.id, Number(id)), eq(shots.userId, authUser.id), eq(shots.department, authUser.profile.activeDepartment)))
    .returning();
  if (!updated[0]) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ item: updated[0] });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(shots).where(and(eq(shots.id, Number(id)), eq(shots.userId, authUser.id), eq(shots.department, authUser.profile.activeDepartment)));
  return NextResponse.json({ ok: true });
}
