import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ profile: authUser.profile, user: { id: authUser.id, name: authUser.name, email: authUser.email, roleTitle: authUser.roleTitle } });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const allowed: Record<string, unknown> = {};
    const fields = [
      "primaryDepartment",
      "secondaryDepartments",
      "workTypes",
      "experienceLevel",
      "activeDepartment",
      "completedOnboarding",
    ];

    for (const f of fields) {
      if (f in body) {
        allowed[f] = typeof body[f] === "object" ? JSON.stringify(body[f]) : String(body[f]);
        if (f === "completedOnboarding") {
          allowed[f] = Boolean(body[f]);
        }
      }
    }
    allowed.updatedAt = new Date();

    const updated = await db
      .update(userProfiles)
      .set(allowed)
      .where(eq(userProfiles.userId, authUser.id))
      .returning();

    const p = updated[0];
    const profileObj = {
      id: p.id,
      userId: p.userId,
      primaryDepartment: p.primaryDepartment || "cinematography",
      secondaryDepartments: parseJsonArray(p.secondaryDepartments),
      workTypes: parseJsonArray(p.workTypes),
      experienceLevel: p.experienceLevel || "working-professional",
      activeDepartment: p.activeDepartment || p.primaryDepartment || "cinematography",
      completedOnboarding: Boolean(p.completedOnboarding),
    };

    return NextResponse.json({ profile: profileObj, user: { id: authUser.id, name: authUser.name, email: authUser.email, roleTitle: authUser.roleTitle } });
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
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
