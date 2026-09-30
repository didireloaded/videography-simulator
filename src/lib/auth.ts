import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const COOKIE_NAME = "framelab_user_id";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  roleTitle: string;
  profile: {
    id: number;
    userId: number;
    primaryDepartment: string;
    secondaryDepartments: string[];
    workTypes: string[];
    experienceLevel: string;
    activeDepartment: string;
    completedOnboarding: boolean;
  };
};

export async function seedDefaultUsers() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) return;

  const defaultUsersData = [
    {
      email: "marcus@framelab.test",
      name: "Marcus Thorne",
      passwordHash: "demo123",
      roleTitle: "Director of Photography",
      primaryDepartment: "cinematography",
      secondaryDepartments: '["lighting-grip", "directing"]',
      activeDepartment: "cinematography",
      experienceLevel: "working-professional",
      completedOnboarding: true,
    },
    {
      email: "elena@framelab.test",
      name: "Elena Vance",
      passwordHash: "demo123",
      roleTitle: "Film Director",
      primaryDepartment: "directing",
      secondaryDepartments: '["cinematography", "script-continuity"]',
      activeDepartment: "directing",
      experienceLevel: "department-head",
      completedOnboarding: true,
    },
    {
      email: "chloe@framelab.test",
      name: "Chloe Bennett",
      passwordHash: "demo123",
      roleTitle: "Location Sound Mixer",
      primaryDepartment: "sound",
      secondaryDepartments: '["editing-post"]',
      activeDepartment: "sound",
      experienceLevel: "working-professional",
      completedOnboarding: true,
    },
    {
      email: "sonia@framelab.test",
      name: "Sonia Rao",
      passwordHash: "demo123",
      roleTitle: "Production Designer",
      primaryDepartment: "production-design",
      secondaryDepartments: '["directing"]',
      activeDepartment: "production-design",
      experienceLevel: "department-head",
      completedOnboarding: true,
    },
  ];

  for (const u of defaultUsersData) {
    const insertedUser = await db
      .insert(users)
      .values({
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash,
        roleTitle: u.roleTitle,
      })
      .returning();

    const userId = insertedUser[0].id;
    await db.insert(userProfiles).values({
      userId: userId,
      primaryDepartment: u.primaryDepartment,
      secondaryDepartments: u.secondaryDepartments,
      workTypes: '["Narrative films", "Commercials"]',
      experienceLevel: u.experienceLevel,
      activeDepartment: u.activeDepartment,
      completedOnboarding: u.completedOnboarding,
    });
  }
}

export async function getAuthUser(req?: NextRequest): Promise<AuthUser | null> {
  await seedDefaultUsers();

  let userId = 1; // Default to Marcus Thorne (user 1) if no cookie
  if (req) {
    const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
    if (cookieVal && !isNaN(Number(cookieVal))) {
      userId = Number(cookieVal);
    }
  }

  const userRows = await db.select().from(users).where(eq(users.id, userId));
  if (!userRows[0]) {
    // If cookie user was deleted or invalid, fallback to user 1
    const fallback = await db.select().from(users).where(eq(users.id, 1));
    if (!fallback[0]) return null;
    userId = fallback[0].id;
  }

  const u = (await db.select().from(users).where(eq(users.id, userId)))[0];
  if (!u) return null;

  let p = (await db.select().from(userProfiles).where(eq(userProfiles.userId, u.id)))[0];
  if (!p) {
    const inserted = await db
      .insert(userProfiles)
      .values({
        userId: u.id,
        primaryDepartment: "cinematography",
        secondaryDepartments: "[]",
        workTypes: '["Narrative films"]',
        experienceLevel: "working-professional",
        activeDepartment: "cinematography",
        completedOnboarding: false,
      })
      .returning();
    p = inserted[0];
  }

  return {
    id: u.id,
    email: u.email,
    name: u.name,
    roleTitle: u.roleTitle,
    profile: {
      id: p.id,
      userId: p.userId,
      primaryDepartment: p.primaryDepartment || "cinematography",
      secondaryDepartments: parseJsonArray(p.secondaryDepartments),
      workTypes: parseJsonArray(p.workTypes),
      experienceLevel: p.experienceLevel || "working-professional",
      activeDepartment: p.activeDepartment || p.primaryDepartment || "cinematography",
      completedOnboarding: Boolean(p.completedOnboarding),
    },
  };
}

export function setAuthCookie(res: NextResponse, userId: number) {
  res.cookies.set(COOKIE_NAME, String(userId), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });
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
