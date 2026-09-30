import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shots } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ items: [] }, { status: 401 });

  const rows = await db
    .select()
    .from(shots)
    .where(and(eq(shots.userId, authUser.id), eq(shots.department, authUser.profile.activeDepartment)))
    .orderBy(asc(shots.position), asc(shots.id));
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const department = authUser.profile.activeDepartment;
  const maxRow = await db.select({ p: shots.position }).from(shots).where(and(eq(shots.userId, authUser.id), eq(shots.department, department)));
  const nextPos = maxRow.reduce((m, r) => Math.max(m, r.p), -1) + 1;
  const inserted = await db
    .insert(shots)
    .values({
      userId: authUser.id,
      title: body.title ?? null,
      size: body.size ?? null,
      angle: body.angle ?? null,
      movement: body.movement ?? null,
      lens: body.lens ?? null,
      framerate: body.framerate ?? null,
      support: body.support ?? null,
      audio: body.audio ?? null,
      lighting: body.lighting ?? null,
      description: body.description ?? null,
      priority: body.priority ?? 2,
      position: nextPos,
      department,
    })
    .returning();
  return NextResponse.json({ item: inserted[0] });
}
