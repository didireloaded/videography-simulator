import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favourites } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ items: [] }, { status: 401 });

  const rows = await db
    .select()
    .from(favourites)
    .where(and(eq(favourites.userId, authUser.id), eq(favourites.department, authUser.profile.activeDepartment)))
    .orderBy(favourites.createdAt);
  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { slug, title, category, accent } = body as {
    slug?: string;
    title?: string;
    category?: string;
    accent?: string;
  };
  if (!slug || !title || !category) {
    return NextResponse.json({ error: "slug, title, category required" }, { status: 400 });
  }
  await db
    .insert(favourites)
    .values({
      userId: authUser.id,
      slug,
      title,
      category,
      accent: accent ?? "flare",
      department: authUser.profile.activeDepartment,
    })
    .onConflictDoNothing();
  const rows = await db
    .select()
    .from(favourites)
    .where(and(eq(favourites.userId, authUser.id), eq(favourites.department, authUser.profile.activeDepartment)))
    .orderBy(favourites.createdAt);
  return NextResponse.json({ items: rows });
}

export async function DELETE(req: NextRequest) {
  const authUser = await getAuthUser(req);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  await db
    .delete(favourites)
    .where(and(eq(favourites.userId, authUser.id), eq(favourites.department, authUser.profile.activeDepartment), eq(favourites.slug, slug)));
  const rows = await db
    .select()
    .from(favourites)
    .where(and(eq(favourites.userId, authUser.id), eq(favourites.department, authUser.profile.activeDepartment)))
    .orderBy(sql`created_at`);
  return NextResponse.json({ items: rows });
}
