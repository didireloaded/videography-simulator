import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthUser, setAuthCookie, seedDefaultUsers } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const allUsers = await db.select().from(users).orderBy(users.id);

    // Fetch profiles for all users to show their primary department in the account switcher
    const allProfiles = await db.select().from(userProfiles);
    const profileMap = new Map(allProfiles.map((p) => [p.userId, p]));

    const demoUsers = allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roleTitle: u.roleTitle,
      primaryDepartment: profileMap.get(u.id)?.primaryDepartment || "cinematography",
    }));

    return NextResponse.json({
      user: authUser,
      demoUsers,
    });
  } catch (error) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await seedDefaultUsers();
    const body = await req.json().catch(() => ({}));
    const { action, userId, email, password, name, department, roleTitle } = body;

    if (action === "switch" && userId) {
      const targetUser = (await db.select().from(users).where(eq(users.id, Number(userId))))[0];
      if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const res = NextResponse.json({ ok: true, userId: targetUser.id });
      setAuthCookie(res, targetUser.id);
      return res;
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }
      const targetUser = (await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())))[0];
      if (!targetUser || targetUser.passwordHash !== password) {
        return NextResponse.json({ error: "Invalid email or password (try demo123 for demo users)" }, { status: 401 });
      }
      const res = NextResponse.json({ ok: true, userId: targetUser.id });
      setAuthCookie(res, targetUser.id);
      return res;
    }

    if (action === "signup") {
      if (!email || !name || !password) {
        return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
      }
      const existing = (await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())))[0];
      if (existing) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      }

      const insertedUser = await db
        .insert(users)
        .values({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          passwordHash: password,
          roleTitle: roleTitle || "Filmmaker",
        })
        .returning();

      const newUserId = insertedUser[0].id;
      const primaryDept = department || "cinematography";

      await db.insert(userProfiles).values({
        userId: newUserId,
        primaryDepartment: primaryDept,
        secondaryDepartments: "[]",
        workTypes: '["Narrative films"]',
        experienceLevel: "working-professional",
        activeDepartment: primaryDept,
        completedOnboarding: false,
      });

      const res = NextResponse.json({ ok: true, userId: newUserId });
      setAuthCookie(res, newUserId);
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ ok: true, userId: 1 });
      setAuthCookie(res, 1); // Reset to default demo user on logout
      return res;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: "Authentication action failed" }, { status: 500 });
  }
}
