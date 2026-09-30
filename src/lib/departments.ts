import type { IconName } from "@/components/Icon";

export type DepartmentId =
  | "directing"
  | "cinematography"
  | "lighting-grip"
  | "sound"
  | "assistant-directing"
  | "production"
  | "production-design"
  | "script-continuity"
  | "editing-post";

export type DepartmentDef = {
  id: DepartmentId;
  name: string;
  shortName: string;
  icon: IconName;
  blurb: string;
  documentStyle: string;
  documentTitle: string;
  color: string; // CSS color string or hex for tags
};

export const DEPARTMENTS: DepartmentDef[] = [
  {
    id: "cinematography",
    name: "Cinematography",
    shortName: "Cinematography",
    icon: "camera",
    blurb: "Camera tests, optical staging, exposure, and lighting integration.",
    documentStyle: "Camera Test & Report Sheet",
    documentTitle: "CINEMATOGRAPHY FIELD NOTES",
    color: "#a8362a", // production red
  },
  {
    id: "directing",
    name: "Directing",
    shortName: "Directing",
    icon: "clapperboard",
    blurb: "Scene breakdown, character beats, blocking, coverage, and storyboards.",
    documentStyle: "Director's Scene Notes & Blocking Plan",
    documentTitle: "DIRECTING WORKBOOK",
    color: "#375c7d", // blue pen
  },
  {
    id: "lighting-grip",
    name: "Lighting and Grip",
    shortName: "Grip & Electric",
    icon: "lighting-grip",
    blurb: "Fixture distribution, ratios, power planning, and rigging safety.",
    documentStyle: "Lighting Diagram & Power Plan",
    documentTitle: "LIGHTING & GRIP REPORT",
    color: "#a8781f", // ochre/amber
  },
  {
    id: "sound",
    name: "Sound",
    shortName: "Sound",
    icon: "sound",
    blurb: "Acoustic placement, wireless rigging, gain staging, and room tone.",
    documentStyle: "Location Sound Log & Gain Sheet",
    documentTitle: "SOUND DEPARTMENT REPORT",
    color: "#4c6b43", // green ink
  },
  {
    id: "assistant-directing",
    name: "Assistant Directing",
    shortName: "1st / 2nd AD",
    icon: "assistant-directing",
    blurb: "Shooting schedule, call sheets, cast/location tracking, and set safety.",
    documentStyle: "Daily Call Sheet & Schedule Breakdown",
    documentTitle: "AD SCHEDULE & CALL SHEET",
    color: "#7d241d", // deep red
  },
  {
    id: "production",
    name: "Production",
    shortName: "Production",
    icon: "production",
    blurb: "Timeline, budgets, crew allocation, location permits, and insurance.",
    documentStyle: "Production Binder & Deliverables Tracker",
    documentTitle: "PRODUCTION MANAGER BINDER",
    color: "#5c81a0",
  },
  {
    id: "production-design",
    name: "Production Design",
    shortName: "Art Dept",
    icon: "production-design",
    blurb: "Colour palettes, mood boards, set dressing, props, and wardrobe.",
    documentStyle: "Design Palette & Continuity Board",
    documentTitle: "ART DEPARTMENT BINDER",
    color: "#a8781f",
  },
  {
    id: "script-continuity",
    name: "Script and Continuity",
    shortName: "Script Sup",
    icon: "script-continuity",
    blurb: "Take logging, eyeline tracking, dialogue changes, and continuity photos.",
    documentStyle: "Daily Take Logger & Continuity Sheet",
    documentTitle: "SCRIPT SUPERVISOR LOG",
    color: "#375c7d",
  },
  {
    id: "editing-post",
    name: "Editing and Post",
    shortName: "Post & VFX",
    icon: "editing-post",
    blurb: "Coverage assembly, codecs, proxy workflow, color, and delivery formats.",
    documentStyle: "Post-Production Timeline & Handover Sheet",
    documentTitle: "POST & EDITING BINDER",
    color: "#a8362a",
  },
];

export const WORK_TYPES = [
  "Narrative films",
  "Commercials",
  "Music videos",
  "Documentaries",
  "Events",
  "Social content",
  "Photography",
];

export const EXPERIENCE_LEVELS = [
  { id: "learning", label: "Learning", desc: "Building core production knowledge & set terminology" },
  { id: "junior-crew", label: "Junior crew", desc: "PA, utility, 2nd AC, or assisting on active sets" },
  { id: "working-professional", label: "Working professional", desc: "Regular department operator, mixer, or gaffer" },
  { id: "department-head", label: "Department head", desc: "DP, Director, 1st AD, Sound Supervisor, or Lead Designer" },
];

export function getDepartment(id: string): DepartmentDef {
  return DEPARTMENTS.find((d) => d.id === id) ?? DEPARTMENTS[0];
}

// Rules for production item sharing between departments
export function canViewSharedItem(itemType: string, ownerDept: string, viewerDept: string): boolean {
  if (ownerDept === viewerDept || viewerDept === "all") return true;
  if (itemType === "shooting-schedule" || itemType === "call-sheet" || itemType === "script" || itemType === "locations" || itemType === "crew-contacts") {
    // Schedules, call sheets, script, locations, and crew contacts are visible to all departments
    return true;
  }
  if (itemType === "shot-list") {
    // Shot lists are shared between Directing, Cinematography and Assistant Directing
    const allowed = ["directing", "cinematography", "assistant-directing"];
    return allowed.includes(ownerDept) && allowed.includes(viewerDept);
  }
  if (itemType === "lighting-plan") {
    // Lighting plans are shared between Cinematography and Lighting and Grip
    const allowed = ["cinematography", "lighting-grip"];
    return allowed.includes(ownerDept) && allowed.includes(viewerDept);
  }
  if (itemType === "sound-report") {
    // Sound reports are shared between Sound and Editing
    const allowed = ["sound", "editing-post"];
    return allowed.includes(ownerDept) && allowed.includes(viewerDept);
  }
  if (itemType === "camera-report") {
    // Camera reports are shared between Cinematography, Script and Editing
    const allowed = ["cinematography", "script-continuity", "editing-post"];
    return allowed.includes(ownerDept) && allowed.includes(viewerDept);
  }
  if (itemType === "continuity-note" || itemType === "scene-breakdown") {
    // Continuity notes and scene breakdowns are shared between Script, Directing and Editing
    const allowed = ["script-continuity", "directing", "editing-post", "cinematography"];
    return allowed.includes(ownerDept) && allowed.includes(viewerDept);
  }
  return false;
}
