import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects, projectCrew, projectItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function seedDefaultProjectIfEmpty() {
  const existing = await db.select().from(projects);
  if (existing.length > 0) return existing;

  const inserted = await db
    .insert(projects)
    .values({
      title: "Midnight Transit — Short Narrative",
      projectType: "narrative",
      description: "A tense dialogue scene on an empty late-night subway car. 3-day location shoot.",
      status: "prep",
    })
    .returning();

  const pId = inserted[0].id;

  // Seed default crew across departments
  await db.insert(projectCrew).values([
    { projectId: pId, name: "Elena Vance", role: "Director", department: "directing", contact: "elena@production.test", notes: "Prefers 2-camera dialogue coverage" },
    { projectId: pId, name: "Marcus Thorne", role: "Director of Photography", department: "cinematography", contact: "marcus@production.test", notes: "Shooting Alexa Mini LF + Superspeeds" },
    { projectId: pId, name: "David Chen", role: "Gaffer", department: "lighting-grip", contact: "david@production.test", notes: "Prepping practical subway fluorescent replacements" },
    { projectId: pId, name: "Sonia Rao", role: "Production Designer", department: "production-design", contact: "sonia@production.test", notes: "Color palette: gritty steel blue & warm sodium" },
    { projectId: pId, name: "Liam Gallagher", role: "1st AD", department: "assistant-directing", contact: "liam@production.test", notes: "Subway location window is strictly 11pm - 4am" },
    { projectId: pId, name: "Chloe Bennett", role: "Sound Mixer", department: "sound", contact: "chloe@production.test", notes: "Using double lavs + hypercardioid boom" },
    { projectId: pId, name: "Tariq Miller", role: "Script Supervisor", department: "script-continuity", contact: "tariq@production.test", notes: "Logging eyeline crossing on center pole" },
    { projectId: pId, name: "Jessica Park", role: "Lead Editor", department: "editing-post", contact: "jess@posthouse.test", notes: "Proxy workflow: ProRes 422 Proxy @ 1080p" },
  ]);

  // Seed shared and department items
  await db.insert(projectItems).values([
    {
      projectId: pId,
      itemType: "script",
      title: "Scene 14 — Subway Confrontation (Revisions v2)",
      content: "EXT/INT. SUBWAY CAR - NIGHT\nThe fluorescent lights flicker overhead. ARTHUR (40s) grips his briefcase, watching KELSEY (30s) enter from the connecting door. She sits directly opposite him.\n\nARTHUR: You're three stops late.\n\nKELSEY: The tunnel signals were down. Did you bring the hard drive?",
      department: "directing",
      sharedWith: '["all"]',
      updatedBy: "Elena Vance",
    },
    {
      projectId: pId,
      itemType: "shooting-schedule",
      title: "Day 2 Shooting Schedule — Subway Platform & Car",
      content: "23:00 - Crew Call & Security Briefing\n23:30 - Block & Light Scene 14 (Subway Car)\n01:15 - First Unit Rolling: Sc 14 Masters & OTS\n03:00 - Company Move to Platform (Scene 15)\n04:00 - Location Wrap & Tail Lights",
      department: "assistant-directing",
      sharedWith: '["all"]',
      updatedBy: "Liam Gallagher",
    },
    {
      projectId: pId,
      itemType: "call-sheet",
      title: "Call Sheet #2 — Friday Nov 14",
      content: "LOCATION: Transit Museum Tunnel B, Entry Gate 4\nWEATHER: Night exterior 45°F, clear.\nNEAREST HOSPITAL: St. Jude Emergency, 400 Main St.\nGENERAL NOTE: All crew must wear reflective vests on track level.",
      department: "production",
      sharedWith: '["all"]',
      updatedBy: "Liam Gallagher",
    },
    {
      projectId: pId,
      itemType: "lighting-plan",
      title: "Subway Car Top-Down Lighting Plan",
      content: "Key Light: 4x Asteras rigged to ceiling handrails (5600K matched to practicals with 1/4 Plus Green).\nFill: 4x4 Unbleached Muslin bounce on floor.\nRim/Backlight: LED Fresnel outside subway window raking through glass.",
      department: "cinematography",
      sharedWith: '["lighting-grip"]',
      updatedBy: "Marcus Thorne",
    },
    {
      projectId: pId,
      itemType: "sound-report",
      title: "Sound Report — Roll 04 (Subway Car Ambiance)",
      content: "Track 1: Boom (Hypercardioid) — Chasing dialogue\nTrack 2: Arthur Lav (Sanken Cos-11 hidden in tie)\nTrack 3: Kelsey Lav (Sanken Cos-11 collar rig)\nTrack 4: Safety Mix (-10dB)\nNOTE: Slight rail hum on takes 1 & 2. Take 3 circle take clean.",
      department: "sound",
      sharedWith: '["editing-post"]',
      updatedBy: "Chloe Bennett",
    },
    {
      projectId: pId,
      itemType: "camera-report",
      title: "Camera Report — Mag A004",
      content: "Scene 14 | Slate 14A | Take 1-4 | 35mm Prime | T2.0 | ISO 800\nTake 3: Circle Take. Perfect focus pull from Briefcase to Kelsey's entrance.\nTake 4: Tail slate, actor flubbed line at end.",
      department: "cinematography",
      sharedWith: '["script-continuity", "editing-post"]',
      updatedBy: "Marcus Thorne",
    },
    {
      projectId: pId,
      itemType: "continuity-note",
      title: "Continuity Log — Scene 14 Wardrobe & Props",
      content: "Arthur's briefcase lock is unlatched on left side from Take 2 onwards. Keep unlatched for close-up coverage.\nKelsey's scarf is tucked inside coat on left shoulder.",
      department: "script-continuity",
      sharedWith: '["directing", "editing-post"]',
      updatedBy: "Tariq Miller",
    },
  ]);

  return [inserted[0]];
}

export async function GET() {
  try {
    await seedDefaultProjectIfEmpty();
    const allProjects = await db.select().from(projects).orderBy(desc(projects.updatedAt));
    return NextResponse.json({ items: allProjects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const inserted = await db
      .insert(projects)
      .values({
        ownerUserId: authUser.id,
        title: body.title,
        projectType: body.projectType ?? "narrative",
        description: body.description ?? "",
        status: body.status ?? "prep",
      })
      .returning();

    const pId = inserted[0].id;
    const dept = body.department ?? authUser.profile.activeDepartment ?? "cinematography";
    
    await db.insert(projectCrew).values({
      projectId: pId,
      userId: authUser.id,
      name: body.creatorName ?? authUser.name,
      role: authUser.roleTitle || "Department Lead",
      department: dept,
      contact: authUser.email,
      notes: "Project Creator",
    });

    return NextResponse.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
